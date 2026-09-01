import chicken65 from "../assets/food/chicken-65.png";
import chickenBiryani from "../assets/food/chicken-biryani.png";
import chickenLollipop from "../assets/food/chicken-lollipop.png";
import friedRice from "../assets/food/fried-rice.png";
import gulabJamun from "../assets/food/gulab-jamun.png";
import iceCream from "../assets/food/ice-cream.png";
import naan from "../assets/food/naan.png";
import paneerTikka from "../assets/food/paneer-tikka.png";
import vegBiryani from "../assets/food/veg-biryani.png";
import vegManchurian from "../assets/food/veg-manchurian.png";

const menuData = [
  {
    id: 1,
    name: "Chicken Biryani",
    image: chickenBiryani,
    price: "₹299",
    dietaryType: "Non-Veg",
    category: "Non-Veg",
    description:
      "Aromatic basmati rice cooked with tender chicken and traditional spices.",
    ingredients: [
      "Chicken",
      "Basmati Rice",
      "Onion",
      "Biryani Masala",
      "Mint",
    ],
    taste: ["Spicy", "Savory"],
    spiceLevel: 5,
    spiceText: "Spicy",
    cookingStyle: "Dum Cooked",
  },

  {
    id: 2,
    name: "Gulab Jamun",
    image: gulabJamun,
    price: "₹99",
    dietaryType: "Veg",
    category: "Desserts",
    description:
      "Soft and delicious milk dumplings soaked in sweet sugar syrup.",
    ingredients: [
      "Milk Powder",
      "Flour",
      "Sugar",
      "Cardamom",
      "Ghee",
    ],
    taste: ["Sweet", "Rich"],
    spiceLevel: 0,
    spiceText: "Not Spicy",
    cookingStyle: "Deep Fried",
  },

  {
    id: 3,
    name: "Paneer Tikka",
    image: paneerTikka,
    price: "₹249",
    dietaryType: "Veg",
    category: "Veg",
    description:
      "Grilled paneer cubes marinated with Indian spices and yogurt.",
    ingredients: [
      "Paneer",
      "Yogurt",
      "Capsicum",
      "Onion",
      "Indian Spices",
    ],
    taste: ["Spicy", "Smoky"],
    spiceLevel: 3,
    spiceText: "Medium",
    cookingStyle: "Grilled",
  },

  {
    id: 4,
    name: "Chicken 65",
    image: chicken65,
    price: "₹229",
    dietaryType: "Non-Veg",
    category: "Non-Veg",
    description:
      "Crispy fried chicken pieces with spices and curry leaves.",
    ingredients: [
      "Chicken",
      "Corn Flour",
      "Red Chilli",
      "Curry Leaves",
      "Ginger Garlic",
    ],
    taste: ["Spicy", "Crispy"],
    spiceLevel: 5,
    spiceText: "Spicy",
    cookingStyle: "Deep Fried",
  },

  {
    id: 5,
    name: "Veg Manchurian",
    image: vegManchurian,
    price: "₹199",
    dietaryType: "Veg",
    category: "Veg",
    description:
      "Crispy vegetable balls cooked in a delicious Indo-Chinese sauce.",
    ingredients: [
      "Cabbage",
      "Carrot",
      "Capsicum",
      "Corn Flour",
      "Manchurian Sauce",
    ],
    taste: ["Spicy", "Tangy"],
    spiceLevel: 3,
    spiceText: "Medium",
    cookingStyle: "Stir Fried",
  },

  {
    id: 6,
    name: "Chicken Lollipop",
    image: chickenLollipop,
    price: "₹249",
    dietaryType: "Non-Veg",
    category: "Non-Veg",
    description:
      "Juicy chicken lollipops marinated with spices and cooked until crispy.",
    ingredients: [
      "Chicken",
      "Red Chilli",
      "Ginger Garlic",
      "Corn Flour",
      "Spices",
    ],
    taste: ["Spicy", "Crispy"],
    spiceLevel: 4,
    spiceText: "Spicy",
    cookingStyle: "Deep Fried",
  },

  {
    id: 7,
    name: "Veg Biryani",
    image: vegBiryani,
    price: "₹219",
    dietaryType: "Veg",
    category: "Veg",
    description:
      "Fragrant basmati rice cooked with fresh vegetables and aromatic spices.",
    ingredients: [
      "Basmati Rice",
      "Carrot",
      "Beans",
      "Peas",
      "Biryani Masala",
    ],
    taste: ["Spicy", "Aromatic"],
    spiceLevel: 3,
    spiceText: "Medium",
    cookingStyle: "Dum Cooked",
  },

  {
    id: 8,
    name: "Butter Naan",
    image: naan,
    price: "₹49",
    dietaryType: "Veg",
    category: "Veg",
    description:
      "Soft Indian flatbread brushed with delicious melted butter.",
    ingredients: [
      "Flour",
      "Butter",
      "Yogurt",
      "Salt",
      "Nigella Seeds",
    ],
    taste: ["Buttery", "Soft"],
    spiceLevel: 0,
    spiceText: "Not Spicy",
    cookingStyle: "Tandoor Baked",
  },

  {
    id: 9,
    name: "Fried Rice",
    image: friedRice,
    price: "₹179",
    dietaryType: "Veg",
    category: "Veg",
    description:
      "Delicious fried rice prepared with vegetables and aromatic seasonings.",
    ingredients: [
      "Rice",
      "Carrot",
      "Beans",
      "Spring Onion",
      "Soy Sauce",
    ],
    taste: ["Savory", "Mild"],
    spiceLevel: 2,
    spiceText: "Mild",
    cookingStyle: "Stir Fried",
  },

  {
    id: 10,
    name: "Ice Cream",
    image: iceCream,
    price: "₹89",
    dietaryType: "Veg",
    category: "Desserts",
    description:
      "Creamy and refreshing ice cream served as a perfect sweet ending.",
    ingredients: [
      "Milk",
      "Cream",
      "Sugar",
      "Vanilla",
    ],
    taste: ["Sweet", "Creamy"],
    spiceLevel: 0,
    spiceText: "Not Spicy",
    cookingStyle: "Chilled",
  },
];

export default menuData;