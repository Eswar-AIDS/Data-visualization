(function() {
    google.charts.load('current', {
		packages: ['corechart']
	});

	const categoryPercentages = [
		['Electronics', 30],
		['Fashion', 25],
		['Home & Garden', 20],
		['Sports', 15],
		['Books', 10]
	];

	let currentChart = null;

	google.charts.setOnLoadCallback(initialize);

	function initialize() {
		const selector = document.getElementById('chartType');
		if (selector) {
			selector.addEventListener('change', drawSelectedChart);
		}
		window.addEventListener('resize', drawSelectedChart);
		drawSelectedChart();
	}

	function getCommonOptions(title) {
		return {
			title: 'Data Visualization on E-Commerce',
			legend: { position: 'right' },
			chartArea: { left: 70, top: 60, width: '70%', height: '70%' },
			width: '100%',
			height: 600
		};
	}

	function drawSelectedChart() {
		const selector = document.getElementById('chartType');
		const type = selector ? selector.value : 'pie';
		const container = document.getElementById('chart');
		if (!container) return;

		if (currentChart && currentChart.clearChart) {
			currentChart.clearChart();
		}

			switch (type) {
			case 'bar':
				drawBar(container);
				break;
			case 'line':
				drawLine(container);
				break;
			case 'scatter':
				drawScatter(container);
				break;
			case 'box':
				drawBox(container);
				break;
			case 'pie':
			default:
				drawPie(container);
		}
	}

	function buildCategoryDataTable() {
		const data = new google.visualization.DataTable();
		data.addColumn('string', 'Category');
		data.addColumn('number', 'Percentage');
		data.addRows(categoryPercentages);
		return data;
	}

	function drawPie(container) {
		const data = buildCategoryDataTable();
		const options = getCommonOptions('Category distribution (Pie)');
		currentChart = new google.visualization.PieChart(container);
		currentChart.draw(data, options);
	}

	function drawBar(container) {
		const data = buildCategoryDataTable();
		const options = Object.assign({}, getCommonOptions('Category distribution (Bar)'), {
			legend: { position: 'none' },
			hAxis: { title: 'Percentage' },
			vAxis: { title: 'Category' }
		});
		currentChart = new google.visualization.BarChart(container);
		currentChart.draw(data, options);
	}

	function drawLine(container) {
		const data = new google.visualization.DataTable();
		data.addColumn('string', 'Category');
		data.addColumn('number', 'Percentage');
		data.addRows(categoryPercentages);
		const options = Object.assign({}, getCommonOptions('Category distribution (Line)'), {
			legend: { position: 'none' },
			hAxis: { title: 'Category' },
			vAxis: { title: 'Percentage' },
			pointSize: 6
		});
		currentChart = new google.visualization.LineChart(container);
		currentChart.draw(data, options);
	}

	function drawScatter(container) {
		const data = new google.visualization.DataTable();
		data.addColumn('number', 'Index');
		data.addColumn('number', 'Percentage');
		categoryPercentages.forEach(function(row, idx) {
			data.addRow([idx + 1, row[1]]);
		});
		const tickLabels = categoryPercentages.map(function(row, idx) {
			return { v: idx + 1, f: row[0] };
		});
		const options = Object.assign({}, getCommonOptions('Category distribution (Scatter)'), {
			legend: { position: 'none' },
			hAxis: {
				title: 'Category',
				viewWindow: { min: 0.5, max: categoryPercentages.length + 0.5 },
				ticks: tickLabels
			},
			vAxis: { title: 'Percentage' }
		});
		currentChart = new google.visualization.ScatterChart(container);
		currentChart.draw(data, options);
	}

//

	// Approximate a box plot using a Candlestick chart by building synthetic whiskers
	function drawBox(container) {
		const rows = categoryPercentages.map(function(entry) {
			const value = entry[1];
			const q1 = Math.max(0, value - 2);
			const q3 = value + 2;
			const min = Math.max(0, value - 4);
			const max = value + 4;
			return [entry[0], min, q1, q3, max];
		});
		const data = new google.visualization.DataTable();
		data.addColumn('string', 'Category');
		data.addColumn('number', 'Min');
		data.addColumn('number', 'Q1');
		data.addColumn('number', 'Q3');
		data.addColumn('number', 'Max');
		data.addRows(rows);
		const options = Object.assign({}, getCommonOptions('Category distribution (Box plot approx.)'), {
			legend: { position: 'none' },
			bar: { groupWidth: '50%' },
			hAxis: { title: 'Category' },
			vAxis: { title: 'Percentage' }
		});
		currentChart = new google.visualization.CandlestickChart(container);
		currentChart.draw(data, options);
    }
})();