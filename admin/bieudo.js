const data = {
  // define label tree
  labels: [
    "A",
    {
      label: "B1",
      expand: false, // 'focus', // expand level
      children: [
        "B1.1",
        {
          label: "B1.2",
          children: ["B1.2.1", "B1.2.2"],
        },
        "B1.3",
      ],
    },
    {
      label: "C1",
      children: ["C1.1", "C1.2", "C1.3", "C1.4"],
    },
    "D",
  ],
  datasets: [
    {
      label: "Test",
      // store as the tree attribute for reference, the data attribute will be automatically managed
      tree: [
        1,
        {
          value: 2,
          children: [
            3,
            {
              value: 4,
              children: [4.1, 4.2],
            },
            5,
          ],
        },
        {
          value: 6,
          children: [7, 8, 9, 10],
        },
        11,
      ],
    },
  ],
};
window.onload = () => {
  const ctx = document.getElementById("hierarchicalChart").getContext("2d");
  window.myBar = new Chart(ctx, {
    type: "bar",
    data: data,
    options: {
      responsive: true,
      title: {
        display: true,
        text: "Chart.js Hierarchical Bar Chart",
      },
      layout: {
        padding: {
          // add more space at the bottom for the hierarchy
          bottom: 45,
        },
      },
      scales: {
        x: {
          type: "hierarchical",
        },
        y: {
          ticks: {
            beginAtZero: true,
          },
        },
      },
    },
  });
};
