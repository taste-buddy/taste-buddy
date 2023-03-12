// URLs for the API

// checks if a URL is reachable
async function checkURL(URL: string) {
    const response = await fetch(URL)
    console.debug('API_URL: ' + URL + ' -> ' + response.ok)
    return response.ok
}

// Try to find a reachable API_URL
const possibleAPI_URLS = ['http://localhost:8081/api/v1', 'http://taste-buddy.sh1.hidora.net:8080/api/v1']
export const API_URL = possibleAPI_URLS.find(checkURL) ?? ''
if (API_URL === '') {
    console.error('No API_URL found!')
}

export enum API_ROUTE {
    GET_RECIPES,
    ADD_RECIPE,
    DELETE_RECIPE,
    SEARCH_RECIPES,
    GET_ITEMS,
    ADD_ITEM,
    DELETE_ITEM,
    GET_DISCOUNTS,
    GET_MARKETS,
}

type API_ROUTE_OPTIONS = {
    url: string;
    method: string;
}

export const API_ROUTES: { [key in API_ROUTE]: API_ROUTE_OPTIONS } = {
    [API_ROUTE.GET_RECIPES]: { url: '/recipe/', method: 'GET' },
    [API_ROUTE.ADD_RECIPE]: { url: '/recipe/', method: 'POST' },
    [API_ROUTE.DELETE_RECIPE]: { url: '/recipe/RECIPE_ID', method: 'DELETE' },
    [API_ROUTE.SEARCH_RECIPES]: { url: '/search', method: 'POST' },
    [API_ROUTE.GET_ITEMS]: { url: '/item/', method: 'GET' },
    [API_ROUTE.ADD_ITEM]: { url: '/item/', method: 'POST' },
    [API_ROUTE.DELETE_ITEM]: { url: '/item/ITEM_ID', method: 'DELETE' },
    [API_ROUTE.GET_DISCOUNTS]: { url: '/discount/CITY', method: 'GET' },
    [API_ROUTE.GET_MARKETS]: { url: '/discount/markets/CITY', method: 'GET' },
}