import Users from '../requests/users.request.js'
import Login from '../requests/login.request.js'
import Products from '../requests/products.request.js'
import {
	jUnit,
	textSummary,
} from 'https://jslib.k6.io/k6-summary/0.0.1/index.js'
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js'
import { group } from 'k6'

export let options = {
	stages: [
		// Simula o aumento do tráfego de 1 para 20 usuários em 10 segundos.
		{ duration: '30s', target: 10 },

		// Permanecer em 100 usuários por 10 minutos

		{ duration: '1m', target: 5 },

		// Redução para 0 usuários

		{ duration: '30s', target: 0 },
	],
	thresholds: {
		// 99% das solicitações devem ser concluídas abaixo de 1,5 s

		http_req_duration: ['p(99)<1500'],
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
		//'src/junit.xml': jUnit(data),
		'tests/reports/summary.json': JSON.stringify(data),
		'tests/reports/fullFlowLoad.html': htmlReport(data),
	}
}
