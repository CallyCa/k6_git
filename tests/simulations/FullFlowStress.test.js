import Users from '../requests/users.request.js'
import Login from '../requests/login.request.js'
import Products from '../requests/products.request.js'
import { group } from 'k6'
import {
	jUnit,
	textSummary,
} from 'https://jslib.k6.io/k6-summary/0.0.1/index.js'
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js'

export let options = {
	stages: [
		{ duration: '30s', target: 20 },
		{ duration: '30s', target: 21 },
		{ duration: '30s', target: 25 },
		{ duration: '30s', target: 30 },
		{ duration: '30s', target: 32 },
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
}

export function handleSummary(data) {
	return {
		stdout: textSummary(data, { indent: ' ', enableColors: true }),
		//'src/junit.xml': jUnit(data),
		'src/summary.json': JSON.stringify(data),
		'src/fullFlowStress.html': htmlReport(data),
	}
}
