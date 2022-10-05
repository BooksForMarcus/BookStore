const calculatePostage = (cart) => {
  const totalWeight = cart.reduce((total, book) => {
	return total + book.weight*book.numInstock;
  }, 0);
  let postage = 0;

  switch (true) {
	case totalWeight<=0: postage = 0; break;
	case totalWeight<=50: postage = 13; break;
	case totalWeight<=100: postage = 26; break;
	case totalWeight<=250: postage = 52; break;
	case totalWeight<=500: postage = 78; break;
	case totalWeight<=1000: postage = 91; break;
	case totalWeight<=2000: postage = 104; break;
	case totalWeight<=3000: postage = 142; break;
	case totalWeight<=5000: postage = 169; break;
	case totalWeight<=10000: postage = 224; break;
	case totalWeight<=15000: postage = 265; break;
	case totalWeight<=20000: postage = 310; break;
	default: postage = -1; break;
  }
  return postage;
}

export default calculatePostage;