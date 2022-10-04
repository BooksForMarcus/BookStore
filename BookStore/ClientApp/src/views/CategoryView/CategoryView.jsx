import React, { useState } from "react";
import "../../App"
import { useRecoilValue} from "recoil";
import categoriesState from "../../atoms/categoriesState";
import booksState from "../../atoms/booksState";

function CategoryView (){

	const getCategories = useRecoilValue(categoriesState);
	const [category, setCategory] = useState('');
	const books = useRecoilValue(booksState);

	const getCategory = () =>{

			<div>
				{books.filter((book) => {
					if (category ===''){
						return book
					} else return book.categories.includes(c=>c.id === category)
					
				}).map(book => (
					<div>
						<h5>
							{book.title}
						</h5>
					</div>
				))
				}
			</div>
	}

	  return(
		<div>
			<div>
			<h3>Categories</h3>
				<select name="categories" id="" onChange={e => setCategory(e.target.value)}>
					{getCategories.map((category) => (
						<option value={category.id}>{category.name}</option>
					))}
				</select>
			</div>
			
			{getCategory()}
		</div>
	  )
}

export default CategoryView;