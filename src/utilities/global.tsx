export function clearParams(params:string){
    // Remove the given params parameter from the URL
    const url = new URL(window.location.href);
    url.searchParams.delete('error');
    const newUrl = url.toString();
    
    window.history.replaceState({ path: newUrl }, '', newUrl);
    window.location.href = newUrl;
}

export function formatDate(timeStamp: string | number | Date) {
    console.log(timeStamp)
    const formattedDate = new Date(timeStamp).toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return formattedDate;
  }
  
  export function format(value: number): string {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(value);
  }
  