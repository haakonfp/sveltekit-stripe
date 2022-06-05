
import type { RequestEvent, RequestHandler } from '@sveltejs/kit';
import stripe from './_stripe';

export const post: RequestHandler = async (event: RequestEvent) => {

	const req = event.request
	const formData =await req.formData()
	const priceId = formData.get('priceId')
	if (typeof priceId !== 'string') {
		return {
			status: 400,
			headers: {},
			body: JSON.stringify({
				error: {
					message: 'priceId is required'
				}
			})
		};
	}
	
	try {
		const session = await stripe.checkout.sessions.create({
			mode: 'subscription',
			payment_method_types: ['card'],
			line_items: [
				{
					price: priceId,
					quantity: 1
				}
			],
			success_url: `http://${event.url.host}/counter?sessionId={CHECKOUT_SESSION_ID}`,
			cancel_url: `http://${event.url.host}/`
		});
		return {
			status: 200,
			headers: {},
			body: JSON.stringify({
				sessionId: session.id
			})
		};
	} catch (err) {
		return {
			status: 500,
			headers: {},
			body: JSON.stringify({
				error: err
			})
		};
	}
}

// export async function post(req: Request<any, { priceId: string }>): Promise<Response> {
// 	if (typeof req.body.priceId !== 'string') {
// 		return {
// 			status: 400,
// 			headers: {},
// 			body: JSON.stringify({
// 				error: {
// 					message: 'priceId is required'
// 				}
// 			})
// 		};
// 	}

// 	const priceId = req.body.priceId;

// 	try {
// 		const session = await stripe.checkout.sessions.create({
// 			mode: 'subscription',
// 			payment_method_types: ['card'],
// 			line_items: [
// 				{
// 					price: priceId,
// 					quantity: 1
// 				}
// 			],
// 			success_url: `http://${req.host}/counter?sessionId={CHECKOUT_SESSION_ID}`,
// 			cancel_url: `http://${req.host}/`
// 		});
// 		return {
// 			status: 200,
// 			headers: {},
// 			body: JSON.stringify({
// 				sessionId: session.id
// 			})
// 		};
// 	} catch (err) {
// 		return {
// 			status: 500,
// 			headers: {},
// 			body: JSON.stringify({
// 				error: err
// 			})
// 		};
// 	}
// }
