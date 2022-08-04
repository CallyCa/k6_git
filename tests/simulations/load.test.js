import Users from '../requests/users.request.js'
import Login from '../requests/login.request.js'
import Products from '../requests/products.request.js'
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js'
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js'
import { group } from 'k6'

export let options = {
	stages: [
		// Simula o aumento do tráfego de 1 para 5 usuários em 30 segundos.
		{ duration: '30s', target: 5 },

		// Permanecer em 10 usuários por 1 minuto

		{ duration: '1m', target: 10 },

		// Redução para 0 usuários

		{ duration: '30s', target: 0 },
	],
	thresholds: {
		// 99% das solicitações devem ser concluídas abaixo de 1,5 s

		http_req_duration: ['p(99)<1400', 'p(50)<2300'],
		http_req_waiting: ['avg<3000'],
	},
}

export default function () {
	let user = new Users()
	let login = new Login()
	let products = new Products()

	group('List valid users', () => {
		user.list()
	})

	group('Access with admin user', () => {
		login.access()
	})

	group('List products', () => {
		products.list()
	})

	group('Add product', () => {
		products.add(login.getToken())
	})

	group('Delete product', () => {
		products.delete(login.getToken())
	})
}

export function handleSummary(data) {
	return {
		stdout: textSummary(data, { indent: ' ', enableColors: true }),
		'tests/reports/summary.json': JSON.stringify(data),
		'tests/reports/loadTesting.html': htmlReport(data),
	}
}
