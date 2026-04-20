import type { Request } from "../types/request.types";

export function searchRequest(requests: Request[], search: string) {
	const query = search.trim().toLowerCase();

	if (!query) {
		return requests;
	}

	return requests.filter((request) => {
		return (
			request.userName.toLowerCase().includes(query) ||
			request.userPhone.toLowerCase().includes(query) ||
			request.address.toLowerCase().includes(query) ||
			String(request.id).toLowerCase().includes(query)
		);
	});
}
