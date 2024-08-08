import { ref } from 'vue';
import axios from 'axios';

type CartItem = {
    id: number
    title: string
    price: number
    thumbnail: string
}

export const cartItems = ref<CartItem[]>([])

export const addToCart = (item: CartItem) => {
    const existingItem = cartItems.value.find(cartItem => cartItem.id === item.id)
    if (!existingItem) {
        cartItems.value.push(item)
    } else {
        console.log(`Item with id ${item.id} already exists in the cart`)
    }
}

export const removeFromCart = (id: number) => {
    cartItems.value = cartItems.value.filter((item) => item.id !== id)
}

const clearCart = () => {
    cartItems.value = []
}

export const sendToTelegram = (formData: { fullname: string; email: string; phone: string; address: string }) => {
    const message = `
*Contact Details*
--------------------------------------------------
Full Name: ${formData.fullname}
Email: ${formData.email}
Phone: ${formData.phone}
Address: ${formData.address}

*Product Details*
--------------------------------------------------
${cartItems.value.map(item => ` 
    Product Name: ${item.title}   
    Price: $${item.price} `).join('\n')}
--------------------------------------------------
 Total: $${cartItems.value.reduce((total, item) => total + item.price, 0).toFixed(2)}
`;

    axios.post('https://api.telegram.org/bot7082392197:AAFxpM_9qrGyftf5PkmXJNdzOqJsxnedZJc/sendMessage', {
        chat_id: '-1002196059185',
        text: message,
    }).then(response => {
        console.log('Message sent to Telegram', response);
        clearCart(); // Clear the cart after successfully sending the message
    }).catch(error => {
        console.error('Failed to send message to Telegram', error);
    });
}
