const portfolio = {};
let totalPortfolioValue = 0;

// Generate random stock prices
function getRandomPrice() {
    return (Math.random() * (500 - 100) + 100).toFixed(2);
}

// Buy Stock Function
function buyStock() {
    const stock = document.getElementById("stock").value;
    const quantity = parseInt(document.getElementById("quantity").value);
    const buyPrice = parseFloat(getRandomPrice());

    if (quantity <= 0) {
        alert("Please enter a valid quantity!");
        return;
    }

    if (!portfolio[stock]) {
        portfolio[stock] = { quantity: 0, buyPrice: 0 };
    }

    let currentStock = portfolio[stock];
    let newQuantity = currentStock.quantity + quantity;
    let newBuyPrice = ((currentStock.buyPrice * currentStock.quantity) + (buyPrice * quantity)) / newQuantity;

    portfolio[stock] = { quantity: newQuantity, buyPrice: newBuyPrice };
    updatePortfolio();
}

// Sell Stock Function
function sellStock() {
    const stock = document.getElementById("stock").value;
    const quantity = parseInt(document.getElementById("quantity").value);

    if (!portfolio[stock] || portfolio[stock].quantity < quantity) {
        alert("Not enough stock to sell!");
        return;
    }

    portfolio[stock].quantity -= quantity;

    if (portfolio[stock].quantity === 0) {
        delete portfolio[stock];
    }

    updatePortfolio();
}

// Update Portfolio Table
function updatePortfolio() {
    const portfolioTable = document.getElementById("portfolio-table");
    const portfolioValueElement = document.getElementById("portfolio-value");

    portfolioTable.innerHTML = "";
    totalPortfolioValue = 0;

    Object.keys(portfolio).forEach(stock => {
        let currentPrice = parseFloat(getRandomPrice());
        let stockData = portfolio[stock];

        let pl = ((currentPrice - stockData.buyPrice) * stockData.quantity).toFixed(2);
        totalPortfolioValue += stockData.quantity * currentPrice;

        let row = `<tr>
                    <td>${stock}</td>
                    <td>${stockData.quantity}</td>
                    <td>$${stockData.buyPrice.toFixed(2)}</td>
                    <td>$${currentPrice}</td>
                    <td style="color: ${pl >= 0 ? 'green' : 'red'}">$${pl}</td>
                   </tr>`;
        portfolioTable.innerHTML += row;
    });

    portfolioValueElement.innerText = totalPortfolioValue.toFixed(2);
    updateChart();
}

// Chart for Asset Allocation
function updateChart() {
    const ctx = document.getElementById("portfolioChart").getContext("2d");
    const stockLabels = Object.keys(portfolio);
    const stockData = stockLabels.map(stock => portfolio[stock].quantity);

    if (window.myChart) {
        window.myChart.destroy();
    }

    window.myChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: stockLabels,
            datasets: [{
                label: "Stock Allocation",
                data: stockData,
                backgroundColor: ["#ff6384", "#36a2eb", "#ffcd56", "#4bc0c0"],
            }]
        }
    });
}

// Initialize Chart
window.onload = updatePortfolio;
