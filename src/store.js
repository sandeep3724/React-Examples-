import { configureStore, createSlice } from '@reduxjs/toolkit';

// Step 1: Create slice for vegetables + non-veg
const vegSlice = createSlice({
  name: 'products',
  initialState: {
    vegItems: [
      { id: 1, category: "veg", name: "Tomato",        description: "Fresh red tomatoes full of flavor, perfect for curries, salads, and soups.", price: 39, image: "/tomato.png" },
      { id: 2, category: "veg", name: "Potato",        description: "Golden potatoes rich in starch, used in fries, curries, and parathas.",      price: 29, image: "/potato.png" },
      { id: 3, category: "veg", name: "Ladies Finger", description: "Green bhindi with a crunchy taste, ideal for stir-fries and curries.",       price: 49, image: "/bendi.png" },
      { id: 4, category: "veg", name: "Carrot",        description: "Crunchy and sweet carrots, rich in Vitamin A, great for salads.",            price: 49, image: "/carrot.png" },
      { id: 5, category: "veg", name: "Cabbage",       description: "Fresh green cabbage, perfect for stir-fry, curries and fries.",              price: 29, image: "/cabbage.png" },
      { id: 6, category: "veg", name: "Cauliflower",   description: "White florets of cauliflower, delicious in curries and pakoras.",            price: 39, image: "/cauliflower.png" },
      { id: 7, category: "veg", name: "Spinach",       description: "Green leafy spinach rich in iron, best for palak paneer and dals.",          price: 19, image: "/spinach.png" },
      { id: 8, category: "veg", name: "Brinjal",       description: "Purple brinjal, soft and tasty, great for curries and bharta.",              price: 39, image: "/brinjal.png" },
      { id: 9, category: "veg", name: "Green Peas",    description: "Sweet and tender green peas, perfect for pulao, curries, and snacks.",       price: 59, image: "/peas.png" },
      { id: 10,category: "veg", name: "Cucumber",      description: "Fresh and crunchy cucumbers, great for salads and raita.",                   price: 49, image: "/cucumber.png" },
      { id: 11,category: "veg", name: "Pumpkin",       description: "Soft and sweet pumpkin, ideal for curries, soups and pulavs.",               price: 49, image: "/pumpkin.png" },
      { id: 12,category: "veg", name: "Bottle Gourd",  description: "Tender bottle gourd, good for soups, curries, and stews.",                   price: 39, image: "/bottle.png" },
      { id: 13,category: "veg", name: "Ridge Gourd",   description: "Green ridge gourd, healthy and perfect for stir-fries and curries.",         price: 39, image: "/ridge.png" },
      { id: 14,category: "veg", name: "Chili",         description: "Fresh green chilies, adds spice to your curries and pickles.",               price: 19, image: "/chilli.png" },
      { id: 15,category: "veg", name: "Fenugreek ",    description: "Fresh methi leaves, rich in nutrients, great for parathas and curries.",     price: 29, image: "/methi.png" }

    ],
    nonvegItems: [
      { id: 1, category: "nonveg", name: "Chicken",             description: "Fresh chicken, tender and juicy, perfect for curries, biryani & roasts.",     price: 249, image: "/chicken.png" },
      { id: 2, category: "nonveg",name: "Mutton",              description: "Premium quality mutton, soft and delicious, ideal for curries.",              price: 899, image: "/mutton.webp" },
      { id: 3, category: "nonveg",name: "Fish",                description: "Fresh river fish, rich in protein, great for fries, curries, and soups.",     price: 399, image: "/fishes.png" },
      { id: 4, category: "nonveg",name: "Prawns",              description: "Juicy prawns full of flavor, perfect for curries, stir-fries, and biryanis.", price: 349, image: "/prawns.png" },
      { id: 5, category: "nonveg",name: "Eggs",                description: "Farm-fresh eggs, full of protein, ideal for omelets, curries, and snacks.",   price: 72,  image: "/eggs.png" },
      { id: 6, category: "nonveg",name: "Boti",                description: "It’s suitable for sitting in Telangana — specially made for drinkers.",       price: 449, image: "/boti.png" },
      { id: 7, category: "nonveg",name: "Mutton Liver",        description: "Fresh mutton liver, rich in iron and protein, ideal for fry or curry.",       price: 349, image: "/muttonliver.png" },
      { id: 8, category: "nonveg",name: "Chicken Kebab",       description: "Spicy and tender chicken kebabs, perfect for grills and snacks.",             price: 249, image: "/chickenkebab.png" },
      { id: 9, category: "nonveg",name: "Fish Fillet",         description: "Boneless fish fillets, great for frying, grilling, and curries.",             price: 349, image: "/fishfillet.png" },
      { id: 10,category: "nonveg",name: "Mutton Kebab",       description: "Juicy mutton kebabs, full of flavor, perfect for grills and parties.",         price: 529, image: "/muttonkebab.png" },
      { id: 11,category: "nonveg",name: "Chicken Drumsticks", description: "Fresh chicken drumsticks, ideal for roasting, curries, and BBQ.",              price: 219, image: "/drum.png" },
      { id: 12,category: "nonveg",name: "Goat Head",          description: "Special delicacy for traditional dishes and biryani preparations.",            price: 639, image: "/head.png" },
      { id: 13,category: "nonveg",      description: "Crispy and juicy chicken wings, perfect for frying, BBQ, and snacks.",         price: 249, image: "/chickenwings.png" },
      { id: 14, category: "nonveg",name: "Mutton Ribs",        description: "Tender and flavorful mutton ribs, ideal for curries, grills, and roasting.",   price: 549, image: "/ribs.png" },
      { id: 15, category: "nonveg",name: "Squid",              description: "Fresh squid, perfect for stir-fries, curries, and seafood dishes.",            price: 699, image: "/squidd.png" }

        ],
  },
  reducers: {}
});


// Step 2: Cart slice
const cartSlice = createSlice({
  name: "Cart",
  initialState: [],
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.find(i => i.id === item.id && i.category === item.category);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.push({ ...item, quantity: 1 });
      }
    },
    incrementQuantity: (state, action) => {
      const item = state.find(i => i.id === action.payload);
      if (item) item.quantity += 1;
    },
    decrementQuantity: (state, action) => {
      const item = state.find(i => i.id === action.payload);
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          return state.filter(i => i.id !== action.payload);
        }
      }
      return state;
    },
    removeFromCart: (state, action) => {
      return state.filter(item => item.id !== action.payload);
    },
    clearCart: () => {
      return [];
    },
  },
});


// ✅ Load users & currentUser from localStorage if available
const savedUsers = JSON.parse(localStorage.getItem("users")) || [];
const savedCurrentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

const initialState = {
  users: savedUsers, 
  currentUser: savedCurrentUser,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    registerUser: (state, action) => {
      state.users.push(action.payload);
      localStorage.setItem("users", JSON.stringify(state.users)); // save to localStorage
    },
    loginUser: (state, action) => {
      const { email, password } = action.payload;
      const foundUser = state.users.find(
        (user) => user.email === email && user.password === password
      );
      if (foundUser) {
        state.currentUser = foundUser;
        localStorage.setItem("currentUser", JSON.stringify(foundUser)); // save logged in user
      } else {
        state.currentUser = null;
        state.error = "ⓘ Please Create an Account";
        localStorage.removeItem("currentUser");
      }
    },
    logoutUser: (state) => {
      state.currentUser = null;
      localStorage.removeItem("currentUser"); // remove from localStorage
    },
  },
});


// Step 3: Configure store
const store = configureStore({
  reducer: {
    products: vegSlice.reducer,
    Cart: cartSlice.reducer,
    users: userSlice.reducer
  }
});

//✅ Persist cart in localStorage every change
store.subscribe(() => {
  localStorage.setItem("cart", JSON.stringify(store.getState().Cart));
})

export const {
  addToCart,
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  clearCart
} = cartSlice.actions;

export const { registerUser, loginUser, logoutUser } = userSlice.actions;


export default store;


