<template>
  <div style="display:flex; flex-direction:column; gap:24px; padding:20px;">

    <!-- KPI Cards -->
    <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:16px;">
      <div v-for="kpi in kpis" :key="kpi.label"
        style="background:#1e1e2f; border:1px solid #333; border-radius:12px; padding:16px;">

        <div style="display:flex; justify-content:space-between;">
          <span style="font-size:12px; color:#aaa;">{{ kpi.label }}</span>
          <div v-html="kpi.icon"></div>
        </div>

        <div style="font-size:24px; font-weight:bold; color:white; margin-top:10px;">
          {{ kpi.value }}
        </div>

        <div style="margin-top:8px; font-size:12px;">
          <span :style="{ color: kpi.trend === 'up' ? '#4ade80' : '#f87171' }">
            {{ kpi.change }}
          </span>
          <span style="color:#888;"> vs last month</span>
        </div>

      </div>
    </div>

    <!-- Revenue Chart -->
    <div style="background:#1e1e2f; padding:20px; border-radius:12px;">
      <h3 style="color:white; margin-bottom:10px;">Revenue Overview</h3>

      <div style="display:flex; align-items:flex-end; height:200px; gap:10px;">
        <div v-for="(bar, i) in revenueData" :key="i"
          style="flex:1; display:flex; flex-direction:column; align-items:center;">

          <div style="width:100%; height:100%; display:flex; align-items:flex-end;">
            <div
              :style="{
                height: (bar.value / maxRevenue * 100) + '%',
                background: '#6366f1',
                width: '100%',
                borderRadius: '4px'
              }"
            ></div>
          </div>

          <span style="font-size:10px; color:#aaa;">{{ bar.month }}</span>
        </div>
      </div>
    </div>

    <!-- Transactions -->
    <div style="background:#1e1e2f; padding:20px; border-radius:12px;">
      <h3 style="color:white; margin-bottom:10px;">Recent Transactions</h3>

      <table style="width:100%; border-collapse:collapse; color:white;">
        <thead>
          <tr style="border-bottom:1px solid #333;">
            <th>ID</th>
            <th>Customer</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="tx in transactions" :key="tx.id"
              style="border-bottom:1px solid #333;">
            <td>{{ tx.id }}</td>
            <td>{{ tx.customer }}</td>
            <td>{{ tx.amount }}</td>
            <td :style="{ color: tx.status === 'paid' ? '#4ade80' : '#fbbf24' }">
              {{ tx.status }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script>
export default {
  name: 'DashboardPage',

  data() {
    return {
      kpis: [
        {
          label: 'Total Revenue',
          value: '$284,390',
          change: '+12.5%',
          trend: 'up',
          icon: '💰'
        },
        {
          label: 'Orders',
          value: '1,847',
          change: '+8%',
          trend: 'up',
          icon: '📦'
        },
        {
          label: 'Customers',
          value: '3,294',
          change: '+5%',
          trend: 'up',
          icon: '👥'
        },
        {
          label: 'Inventory',
          value: '12,056',
          change: '-2%',
          trend: 'down',
          icon: '📊'
        }
      ],

      revenueData: [
        { month: 'Jan', value: 180000 },
        { month: 'Feb', value: 210000 },
        { month: 'Mar', value: 195000 },
        { month: 'Apr', value: 240000 },
        { month: 'May', value: 220000 },
        { month: 'Jun', value: 265000 }
      ],

      transactions: [
        { id: '#1', customer: 'Acme Corp', amount: '$1200', status: 'paid' },
        { id: '#2', customer: 'Beta Ltd', amount: '$890', status: 'pending' },
        { id: '#3', customer: 'Gamma Inc', amount: '$2200', status: 'paid' }
      ]
    }
  },

  computed: {
    maxRevenue() {
      return Math.max(...this.revenueData.map(b => b.value))
    }
  }
}
</script>