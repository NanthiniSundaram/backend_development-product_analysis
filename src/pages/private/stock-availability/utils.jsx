export const mockCategoryData = [
    { name: "Groceries", uid: "Groceries" },
    { name: "Home & Kitchen", uid: "Home & Kitchen" },
    { name: "Electronics", uid: "Electronics" },
    { name: "Fashion", uid: "Fashion" },
    { name: "Beauty", uid: "Beauty" }
];

export const mockCityData = [
    { name: "Delhi", uid: "Delhi" },
    { name: "Mumbai", uid: "Mumbai" },
    { name: "Bangalore", uid: "Bangalore" },
    { name: "Chennai", uid: "Chennai" },
    { name: "Hyderabad", uid: "Hyderabad" },
    { name: "Kolkata", uid: "Kolkata" },
    { name: "Pune", uid: "Pune" }
];

export const mockChartData = {
    dates: [
        "Apr 1", "Apr 2", "Apr 3", "Apr 4", "Apr 5",
        "Apr 6", "Apr 7", "Apr 8", "Apr 9", "Apr 10",
        "Apr 11", "Apr 12", "Apr 13", "Apr 14"
    ],
    unitsData: [124, 145, 156, 132, 167, 135, 178, 186, 165, 149, 139, 156, 178, 187],
    instockData: [35, 42, 38, 25, 45, 48, 52, 58, 42, 48, 52, 60, 55, 59],
    oosData: [15, 8, 12, 25, 5, 12, 8, 2, 18, 12, 8, 5, 10, 5],
    revenueData: [45000, 52000, 58000, 49000, 62000, 55000, 65000, 70000, 61000, 55000, 52000, 58000, 67000, 72000]
};

export const mockProductTableData = [
    {
      product_id: "PRD-10001",
      product_name: "Stainless Steel Water Bottle",
      instock_darkstores_avg: 45,
      instock_darkstores_per: 50,
      available_stock_avg: 180,
      available_stock_avg_per: 75,
      units_sold_drr: 60,
      units_sold_drr_per: 80,
      final_revenue_drr: "54,000",
      oos_darkstores_avg: 20,
      oos_darkstores_per: 25,
      inactive_darkstores_avg: 10,
      inactive_darkstores_per: 20,
      potential_units_drr: 75,
      city_data: [
        {
          city: "Delhi",
          instock_darkstores_avg: 50,
          instock_darkstores_per: 55,
          available_stock_avg: 190,
          units_sold_drr: 65,
          final_revenue_drr: "58,000",
          oos_darkstores_avg: 18,
          oos_darkstores_per: 20,
          inactive_darkstores_avg: 8,
          inactive_darkstores_per: 18,
          potential_units_drr: 80
        },
        {
          city: "Bangalore",
          instock_darkstores_avg: 40,
          instock_darkstores_per: 45,
          available_stock_avg: 170,
          units_sold_drr: 55,
          final_revenue_drr: "50,000",
          oos_darkstores_avg: 22,
          oos_darkstores_per: 28,
          inactive_darkstores_avg: 12,
          inactive_darkstores_per: 22,
          potential_units_drr: 70
        }
      ]
    },
    {
      product_id: "PRD-10002",
      product_name: "Wireless Bluetooth Speaker",
      instock_darkstores_avg: 38,
      instock_darkstores_per: 48,
      available_stock_avg: 150,
      available_stock_avg_per: 70,
      units_sold_drr: 47,
      units_sold_drr_per: 77,
      final_revenue_drr: "41,300",
      oos_darkstores_avg: 28,
      oos_darkstores_per: 35,
      inactive_darkstores_avg: 16,
      inactive_darkstores_per: 25,
      potential_units_drr: 62,
      city_data: [
        {
          city: "Mumbai",
          instock_darkstores_avg: 36,
          instock_darkstores_per: 50,
          available_stock_avg: 140,
          units_sold_drr: 43,
          final_revenue_drr: "39,000",
          oos_darkstores_avg: 30,
          oos_darkstores_per: 38,
          inactive_darkstores_avg: 15,
          inactive_darkstores_per: 24,
          potential_units_drr: 60
        },
        {
          city: "Hyderabad",
          instock_darkstores_avg: 40,
          instock_darkstores_per: 45,
          available_stock_avg: 160,
          units_sold_drr: 51,
          final_revenue_drr: "44,000",
          oos_darkstores_avg: 26,
          oos_darkstores_per: 32,
          inactive_darkstores_avg: 17,
          inactive_darkstores_per: 27,
          potential_units_drr: 64
        }
      ]
    },
    {
      product_id: "PRD-10003",
      product_name: "Smart LED Bulb",
      instock_darkstores_avg: 50,
      instock_darkstores_per: 60,
      available_stock_avg: 200,
      available_stock_avg_per: 85,
      units_sold_drr: 70,
      units_sold_drr_per: 90,
      final_revenue_drr: "63,000",
      oos_darkstores_avg: 15,
      oos_darkstores_per: 20,
      inactive_darkstores_avg: 10,
      inactive_darkstores_per: 15,
      potential_units_drr: 85,
      city_data: [
        {
          city: "Chennai",
          instock_darkstores_avg: 52,
          instock_darkstores_per: 65,
          available_stock_avg: 210,
          units_sold_drr: 75,
          final_revenue_drr: "67,500",
          oos_darkstores_avg: 13,
          oos_darkstores_per: 18,
          inactive_darkstores_avg: 8,
          inactive_darkstores_per: 14,
          potential_units_drr: 88
        },
        {
          city: "Kolkata",
          instock_darkstores_avg: 48,
          instock_darkstores_per: 58,
          available_stock_avg: 190,
          units_sold_drr: 68,
          final_revenue_drr: "61,000",
          oos_darkstores_avg: 17,
          oos_darkstores_per: 22,
          inactive_darkstores_avg: 11,
          inactive_darkstores_per: 16,
          potential_units_drr: 82
        }
      ]
    },
    {
      product_id: "PRD-10004",
      product_name: "Organic Almonds 500g",
      instock_darkstores_avg: 60,
      instock_darkstores_per: 70,
      available_stock_avg: 300,
      available_stock_avg_per: 95,
      units_sold_drr: 90,
      units_sold_drr_per: 95,
      final_revenue_drr: "85,000",
      oos_darkstores_avg: 10,
      oos_darkstores_per: 12,
      inactive_darkstores_avg: 5,
      inactive_darkstores_per: 10,
      potential_units_drr: 95,
      city_data: [
        {
          city: "Delhi",
          instock_darkstores_avg: 62,
          instock_darkstores_per: 72,
          available_stock_avg: 310,
          units_sold_drr: 93,
          final_revenue_drr: "87,000",
          oos_darkstores_avg: 9,
          oos_darkstores_per: 11,
          inactive_darkstores_avg: 4,
          inactive_darkstores_per: 9,
          potential_units_drr: 98
        },
        {
          city: "Pune",
          instock_darkstores_avg: 58,
          instock_darkstores_per: 68,
          available_stock_avg: 290,
          units_sold_drr: 87,
          final_revenue_drr: "83,000",
          oos_darkstores_avg: 11,
          oos_darkstores_per: 13,
          inactive_darkstores_avg: 6,
          inactive_darkstores_per: 11,
          potential_units_drr: 92
        }
      ]
    },
    {
      product_id: "PRD-10005",
      product_name: "Eco-Friendly Notebook",
      instock_darkstores_avg: 25,
      instock_darkstores_per: 40,
      available_stock_avg: 100,
      available_stock_avg_per: 60,
      units_sold_drr: 35,
      units_sold_drr_per: 65,
      final_revenue_drr: "15,000",
      oos_darkstores_avg: 35,
      oos_darkstores_per: 45,
      inactive_darkstores_avg: 18,
      inactive_darkstores_per: 28,
      potential_units_drr: 55,
      city_data: []
    },
    {
      product_id: "PRD-10006",
      product_name: "Rechargeable Table Lamp",
      instock_darkstores_avg: 33,
      instock_darkstores_per: 55,
      available_stock_avg: 120,
      available_stock_avg_per: 68,
      units_sold_drr: 40,
      units_sold_drr_per: 72,
      final_revenue_drr: "27,000",
      oos_darkstores_avg: 25,
      oos_darkstores_per: 32,
      inactive_darkstores_avg: 14,
      inactive_darkstores_per: 24,
      potential_units_drr: 65,
      city_data: []
    },
    {
      product_id: "PRD-10007",
      product_name: "Yoga Mat (Anti-Slip)",
      instock_darkstores_avg: 48,
      instock_darkstores_per: 68,
      available_stock_avg: 190,
      available_stock_avg_per: 82,
      units_sold_drr: 58,
      units_sold_drr_per: 84,
      final_revenue_drr: "49,800",
      oos_darkstores_avg: 18,
      oos_darkstores_per: 21,
      inactive_darkstores_avg: 9,
      inactive_darkstores_per: 14,
      potential_units_drr: 78,
      city_data: []
    },
    {
      product_id: "PRD-10008",
      product_name: "Herbal Green Tea Bags",
      instock_darkstores_avg: 37,
      instock_darkstores_per: 52,
      available_stock_avg: 145,
      available_stock_avg_per: 71,
      units_sold_drr: 46,
      units_sold_drr_per: 76,
      final_revenue_drr: "34,500",
      oos_darkstores_avg: 27,
      oos_darkstores_per: 31,
      inactive_darkstores_avg: 13,
      inactive_darkstores_per: 19,
      potential_units_drr: 66,
      city_data: []
    },
    {
      product_id: "PRD-10009",
      product_name: "Multi-Port USB Charger",
      instock_darkstores_avg: 44,
      instock_darkstores_per: 62,
      available_stock_avg: 175,
      available_stock_avg_per: 78,
      units_sold_drr: 53,
      units_sold_drr_per: 85,
      final_revenue_drr: "46,700",
      oos_darkstores_avg: 20,
      oos_darkstores_per: 26,
      inactive_darkstores_avg: 11,
      inactive_darkstores_per: 17,
      potential_units_drr: 72,
      city_data: []
    },
    {
      product_id: "PRD-10010",
      product_name: "Pack of 3 Cotton T-Shirts",
      instock_darkstores_avg: 60,
      instock_darkstores_per: 74,
      available_stock_avg: 250,
      available_stock_avg_per: 90,
      units_sold_drr: 88,
      units_sold_drr_per: 93,
      final_revenue_drr: "76,200",
      oos_darkstores_avg: 12,
      oos_darkstores_per: 16,
      inactive_darkstores_avg: 7,
      inactive_darkstores_per: 12,
      potential_units_drr: 89,
      city_data: []
    }
  ];

export const OutStockColumns = [
    { label: "PRODUCT NAME", value: "product_name", sortable: true, custom_width: 'w-[15rem]' },
    { label: "INVENTORY", value: "inventory", sortable: true, custom_width: 'w-[6rem]' },
    // { label: "WH INVENTORY", value: "inventory", sortable: true, custom_width: 'w-[6rem]' },
    { label: "ORDERS DRR", value: "units_sold", sortable: true, custom_width: 'w-[6rem]' },
    { label: "INSTOCK DS", value: "instock_darkstores", sortable: true, custom_width: 'w-[6rem]' },
    { label: "OUT OF STOCK DS", value: "outstock_darkstores", sortable: true, custom_width: 'w-[6rem]' },
    { label: "INACTIVE DS", value: "inactive_darkstores", sortable: true, custom_width: 'w-[6rem]' },
    { label: "POTENTIAL UNITS LOSS", value: "potential_loss", sortable: true, custom_width: 'w-[6rem]' },
]; 
