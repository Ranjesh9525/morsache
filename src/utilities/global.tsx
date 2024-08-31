export function clearParams(params:string){
    // Remove the given params parameter from the URL
    const url = new URL(window.location.href);
    url.searchParams.delete('error');
    const newUrl = url.toString();
    
    window.history.replaceState({ path: newUrl }, '', newUrl);
    window.location.href = newUrl;
}