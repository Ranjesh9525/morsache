export function clearParams(params:string){
    // Remove the given params parameter from the URL
    const url = new URL(window.location.href);
    url.searchParams.delete('error');
    window.history.replaceState({}, '', url.toString());
}