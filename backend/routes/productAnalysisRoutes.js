const express = require('express');
const { BigQuery } = require('@google-cloud/bigquery');
const router = express.Router();
const path = require('path');


const bigquery = new BigQuery({
  keyFilename: path.join(__dirname, '../bigquery-key.json'), 
  projectId: 'hackathon-458706',
});


router.get('/product-analysis', async (req, res) => {
  try {
    const query = `
      SELECT
        date,
        product_name,
        product_id,
        brand_name,
        total_orders,
        total_mrp_revenue,
        total_final_revenue
      FROM \`hackathon-458706.hackathon_dataset.product_sales_stock_spends_combined\`
  WHERE total_orders IS NOT NULL
  ORDER BY total_orders DESC
  LIMIT 10
    `;

    const options = {
      query: query,
      location: 'US',
    };

    const [job] = await bigquery.createQueryJob(options);
    const [rows] = await job.getQueryResults();
    res.json(rows);
  } catch (error) {
    console.error('BigQuery Error:', error);
    res.status(500).json({ error: 'Query failed', details: error.message });
  }
});

module.exports = router;
