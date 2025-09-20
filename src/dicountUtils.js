export function calculateTotal (cartItems)
{
return cartItems.reduce((total, item)=> total + item.price * item.quantity, 0);
}

export function calculateButtonDiscount(totalPrice, discountPercentage)
{
    return totalPrice*discountPercentage/100;
}