let getOrderId = new URL(window.location.href).searchParams.get("id");
document.getElementById("orderId").textContent = getOrderId;