addEventListener('fetch', function(event) {
    const { request } = event
    const response = handleRequest(request)
    event.respondWith(response)
})

async function handleRequest(request) {
    const doh = 'https://1.1.1.1/dns-query'
    const contype = 'application/dns-json'
    const { method, headers, url } = request
    const { host, searchParams } = new URL(url)
    if (method == 'GET' && searchParams.has('name')) {
        return await fetch(doh + '?name=' + searchParams.get('name'), {
            method: 'GET',
            headers: {
                'accept': contype,
            }
        });
    } else if (method == 'POST' && headers.get('Content-Type')=='application/dns-message') {
        return await fetch(doh + '?name=' + searchParams.get('name'), {
            method: 'POST',
            headers: {  
                'Content-Type': 'application/dns-message'
            },
            body: await request.arrayBuffer()
        });
    } else {
        return new Response("", {status: 404})
    }
}
