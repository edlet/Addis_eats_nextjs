"use client";
import { useCart } from "../providers";
export default function AddDishButton({ dish }) { const { addItem } = useCart(); return <button className="primary-button" type="button" onClick={() => addItem(dish)}>Add to order</button>; }
