const { Query } = require('bigquery');
const bigquery = require('../config/bigQuery'); // You should have a BigQuery client set up

// Controller function to get product data with filters, sorting, etc.
const getProductAnalysis = async (req, res) => {
  const {
    search,
    platforms,
    date_from,
    date_to,
    sortBy,
    sortOrder,
    page = 1,
    pageSize = 10,
    status,
  } = req.query;

  try {
    const query = `
      SELECT 
        product_name,
        product_id,
        brand_name,
        total_orders,
        total_mrp_revenue,
        total_final_revenue,
        ad_orders,
        ad_spend,
        total_inventory
      FROM product_sales_stock_spends_combined
      WHERE product_name LIKE '%${search}%' 
      AND platforms IN (${platforms.join(',')})
      AND date >= '${date_from}' 
      AND date <= '${date_to}' 
      ${status ? `AND status = '${status}'` : ''}
      ORDER BY ${sortBy} ${sortOrder}
      LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}
    `;

    const [rows] = await bigquery.query(query);
    res.json({ data: rows });
  } catch (error) {
    console.error('Error fetching product data:', error);
    res.status(500).json({ message: 'Error fetching product data' });
  }
};

module.exports = { getProductAnalysis };
