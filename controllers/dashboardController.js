const Lead = require('../models/leadModel');
const Order = require('../models/orderModel');
const ReturnOrder = require('../models/returnOrderModel');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // RBAC check
    const isAdmin = req.user && (
      req.user.roles.includes('admin') || 
      req.user.roles.includes('superadmin') || 
      req.user.email === 'superadmin@gmail.com'
    );

    // Common Date Filters
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        dateFilter.createdAt.$lte = end;
      }
    }

    // Lead query filters
    const leadQuery = { isDeleted: { $ne: true }, isRepeat: { $ne: true }, ...dateFilter };
    if (!isAdmin) {
      leadQuery.assgin = req.user._id;
    }

    // Order query filters
    const orderQuery = { isDeleted: { $ne: true }, ...dateFilter };
    if (!isAdmin) {
      orderQuery.assginTo = req.user._id;
    }

    // Return Order query filters
    const returnOrderQuery = { isDeleted: { $ne: true }, ...dateFilter };
    if (!isAdmin) {
      returnOrderQuery.assginTo = req.user._id;
    }

    // Fetch Base Data
    const [leadsCount, orders, returnOrders] = await Promise.all([
      Lead.countDocuments(leadQuery),
      Order.find(orderQuery).populate('assginTo', 'name').lean(),
      ReturnOrder.find(returnOrderQuery).populate('assginTo', 'name').lean()
    ]);

    // 1. Basic Metrics
    let convertedToOrders = 0;
    orders.forEach(o => {
      if (o.products && o.products.length > 0) {
        convertedToOrders += o.products.reduce((acc, p) => acc + (p.quantity || 1), 0);
      } else {
        convertedToOrders += (o.quantity || 1);
      }
    });
    
    // Total Sell (Sum of grand totals or subtotal for delivered products)
    let totalSell = 0;
    orders.forEach(o => {
      // If grandTotal exists, use it, else sum product subtotals
      if (o.grandTotal) {
        totalSell += o.grandTotal;
      } else if (o.products && o.products.length > 0) {
        totalSell += o.products.reduce((acc, p) => acc + (p.subtotal || 0), 0);
      }
    });

    let totalReturnAmount = 0;
    returnOrders.forEach(r => {
      if (r.amount) {
        totalReturnAmount += r.amount;
      } else if (r.products && r.products.length > 0) {
        totalReturnAmount += r.products.reduce((acc, p) => acc + (p.subtotal || 0), 0);
      }
    });

    let totalReturnOrderCount = 0;
    returnOrders.forEach(r => {
      if (r.products && r.products.length > 0) {
        totalReturnOrderCount += r.products.reduce((acc, p) => acc + (p.quantity || 1), 0);
      } else {
        totalReturnOrderCount += (r.quantity || 1);
      }
    });
    const netRateAmount = totalSell - totalReturnAmount;

    const metrics = {
      totalLeads: leadsCount,
      convertedToOrders: convertedToOrders,
      totalSell: totalSell,
      totalReturnAmount: totalReturnAmount,
      netRateAmount: netRateAmount,
      totalReturnOrderCount: totalReturnOrderCount
    };

    // 2. Report Order Product
    const productStats = {};
    orders.forEach(order => {
      if (order.products) {
        order.products.forEach(p => {
          const pName = p.name || 'Unknown Product';
          if (!productStats[pName]) {
            productStats[pName] = { sellingCount: 0, amount: 0 };
          }
          productStats[pName].sellingCount += (p.quantity || 1);
          productStats[pName].amount += (p.subtotal || 0);
        });
      }
    });

    const productReport = Object.entries(productStats).map(([name, data]) => ({
      name,
      sellingCount: data.sellingCount,
      amount: data.amount
    }));

    // 3. Staff Vise Order Products & Details
    const staffMap = {};

    // Helper to init staff
    const initStaff = (staffId, staffName) => {
      if (!staffMap[staffId]) {
        staffMap[staffId] = {
          staffName,
          staffTotalOrder: 0,
          staffReturnOrder: 0,
          staffOrder: 0, // Net Order
          products: {} // Product details
        };
      }
    };

    // Process Orders for Staff
    orders.forEach(order => {
      const staff = order.assginTo || { _id: 'unassigned', name: 'Super Admin' };
      initStaff(staff._id.toString(), staff.name);
      
      let orderQty = 0;
      if (order.products && order.products.length > 0) {
        orderQty = order.products.reduce((acc, p) => acc + (p.quantity || 1), 0);
      } else {
        orderQty = order.quantity || 1;
      }
      staffMap[staff._id.toString()].staffTotalOrder += orderQty;
      
      if (order.products) {
        order.products.forEach(p => {
          const pName = p.name || 'Unknown Product';
          if (!staffMap[staff._id.toString()].products[pName]) {
            staffMap[staff._id.toString()].products[pName] = {
              productName: pName,
              orderQuantity: 0,
              orderAmount: 0,
              returnQuantity: 0,
              returnAmount: 0,
              totalOrder: 0, // Net Qty
              subtotal: 0 // Net Amount
            };
          }
          const pObj = staffMap[staff._id.toString()].products[pName];
          pObj.orderQuantity += (p.quantity || 1);
          pObj.orderAmount += (p.subtotal || 0);
          pObj.totalOrder += (p.quantity || 1);
          pObj.subtotal += (p.subtotal || 0);
        });
      }
    });

    // Process Return Orders for Staff
    returnOrders.forEach(ret => {
      const staff = ret.assginTo || { _id: 'unassigned', name: 'Super Admin' };
      initStaff(staff._id.toString(), staff.name);
      
      let retQty = 0;
      if (ret.products && ret.products.length > 0) {
        retQty = ret.products.reduce((acc, p) => acc + (p.quantity || 1), 0);
      } else {
        retQty = ret.quantity || 1;
      }
      staffMap[staff._id.toString()].staffReturnOrder += retQty;

      if (ret.products) {
        ret.products.forEach(p => {
          const pName = p.name || 'Unknown Product';
          if (!staffMap[staff._id.toString()].products[pName]) {
            staffMap[staff._id.toString()].products[pName] = {
              productName: pName,
              orderQuantity: 0,
              orderAmount: 0,
              returnQuantity: 0,
              returnAmount: 0,
              totalOrder: 0, // Net Qty
              subtotal: 0 // Net Amount
            };
          }
          const pObj = staffMap[staff._id.toString()].products[pName];
          pObj.returnQuantity += (p.quantity || 1);
          pObj.returnAmount += (p.subtotal || 0);
          pObj.totalOrder -= (p.quantity || 1);
          pObj.subtotal -= (p.subtotal || 0);
        });
      }
    });

    // Finalize Staff Array
    const staffReport = Object.values(staffMap).map(staff => {
      staff.staffOrder = staff.staffTotalOrder - staff.staffReturnOrder;
      staff.products = Object.values(staff.products);
      return staff;
    });

    res.status(200).json({
      metrics,
      productReport,
      staffReport
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats
};
