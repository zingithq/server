import uniqueCodes from '../../constants/uniqueCodes';
import IItemModel from '../../types/IItemModel';
import IResponseMessage from '../../types/IResponseMessage';
import responseHandler from '../../utils/responseHandler';
import isItemAvailable from '../item/item.dal';
import User from '../user/user.model';

type UserCartType = Array<{
	itemId: string;
	outletId: string;
	quantity: number;
}>;

const getUserCart = async (contextObject: {
	userId: string;
}): Promise<IResponseMessage> => {
	const { userId } = contextObject;

	if (!userId || !userId.trim()) {
		return new Promise((resolve) =>
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.invalidUserId,
					functionName: 'getUserCart',
					data: { type: 'error', payload: null },
				})
			)
		);
	}

	const userIdClean = userId.trim();

	try {
		const userCart = await User.findById(userIdClean).select('cart');

		if (!userCart) {
			return new Promise((resolve) =>
				resolve(
					responseHandler({
						uniqueCodeData: uniqueCodes.userNotFound,
						functionName: 'getUserCart',
						data: { type: 'error', payload: null },
					})
				)
			);
		}

		return new Promise((resolve) =>
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.userFound,
					functionName: 'getUserCart',
					data: { type: 'success', payload: userCart },
				})
			)
		);
	} catch (err) {
		return new Promise((resolve) =>
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.internalServerError,
					functionName: 'getUserCart',
					data: { type: 'error', payload: null },
				})
			)
		);
	}
};

const updateCartHelper = async (contextObj: {
	userId: string;
	cart: UserCartType;
}): Promise<IResponseMessage> => {
	const { cart, userId } = contextObj;

	if (!userId || !userId.trim()) {
		return new Promise((resolve) =>
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.invalidUserId,
					functionName: 'updateCartHelper',
					data: { type: 'error', payload: null },
				})
			)
		);
	}

	const userIdClean = userId.trim();

	if (!cart) {
		return new Promise((resolve) =>
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.invalidCart,
					functionName: 'updateCartHelper',
					data: { type: 'error', payload: null },
				})
			)
		);
	}

	if (cart.length !== 0) {
		for (let i = 0; i < cart.length; i += 1) {
			const item = cart[i];
			if (
				!item.itemId ||
				!item.outletId ||
				!item.quantity ||
				!item.itemId.trim() ||
				!item.outletId.trim() ||
				item.quantity < 1
			) {
				return new Promise((resolve) =>
					resolve(
						responseHandler({
							uniqueCodeData: uniqueCodes.invalidCart,
							functionName: 'updateCartHelper',
							data: { type: 'error', payload: null },
						})
					)
				);
			}
		}
	}

	// update cart object in mongoose
	try {
		const user = await User.findByIdAndUpdate(userIdClean, {
			$set: {
				cart,
			},
		});

		if (!user) {
			return new Promise((resolve) =>
				resolve(
					responseHandler({
						uniqueCodeData: uniqueCodes.cartNotUpdated,
						functionName: 'updateCartHelper',
						data: { type: 'error', payload: null },
					})
				)
			);
		}

		return new Promise((resolve) =>
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.cartUpdated,
					functionName: 'updateCartHelper',
					data: { type: 'success', payload: user },
				})
			)
		);
	} catch (err) {
		return new Promise((resolve) =>
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.internalServerError,
					functionName: 'updateCartHelper',
					data: { type: 'error', payload: null },
				})
			)
		);
	}
};

const addItemToCart = async (contextObject: {
	userId: string;
	body: { itemId: string; outletId: string };
}): Promise<IResponseMessage> => {
	const { userId, body } = contextObject;

	if (!userId || !userId.trim()) {
		return new Promise((resolve) =>
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.invalidUserId,
					functionName: 'addItemToCart',
					data: { type: 'error', payload: null },
				})
			)
		);
	}

	const userIdClean = userId.trim();

	const { itemId, outletId } = body;
	if (!itemId || !itemId.trim()) {
		return new Promise((resolve) =>
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.invalidItemId,
					functionName: 'addItemToCart',
					data: { type: 'error', payload: null },
				})
			)
		);
	}

	if (!outletId || !outletId.trim()) {
		return new Promise((resolve) =>
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.invalidOutletId,
					functionName: 'addItemToCart',
					data: { type: 'error', payload: null },
				})
			)
		);
	}

	const itemIdClean = itemId.trim();
	const outletIdClean = outletId.trim();

	const checkItemAvailability: IResponseMessage = await isItemAvailable({
		itemId: itemIdClean,
	});

	if (checkItemAvailability.data.type === 'error') {
		return checkItemAvailability;
	}

	const item = checkItemAvailability.data.payload as IItemModel;

	if (item.outletId !== outletIdClean) {
		return new Promise((resolve) =>
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.unprocessable,
					data: { type: 'error', payload: null },
					functionName: 'addItemToCart',
				})
			)
		);
	}

	const currentUserCartData: IResponseMessage = await getUserCart({
		userId: userIdClean,
	});

	if (currentUserCartData.data.type === 'error') {
		return currentUserCartData;
	}

	const userCart = currentUserCartData.data.payload as UserCartType;

	const newUserCart: UserCartType = userCart;

	if (userCart.length === 0) {
		newUserCart.push({
			itemId: itemIdClean,
			quantity: 1,
			outletId: outletIdClean,
		});
	} else {
		// check if all the outlet ids are same and equal to new outlet id
		if (userCart[userCart.length - 1].outletId !== outletIdClean) {
			return new Promise((resolve) =>
				resolve(
					responseHandler({
						uniqueCodeData: uniqueCodes.unprocessable,
						data: { type: 'error', payload: null },
						functionName: 'addItemToCart',
					})
				)
			);
		}

		// increase the quantity if the item exists already

		const itemIds = userCart.map((i) => i.itemId);

		if (itemIds.includes(itemId)) {
			itemIds.forEach((i, j) => {
				if (i === itemId) {
					newUserCart[j].quantity += 1;
				}
			});
		} else {
			newUserCart.push({
				itemId: itemIdClean,
				outletId: outletIdClean,
				quantity: 1,
			});
		}
	}

	const updatedUserCart: IResponseMessage = await updateCartHelper({
		userId: userIdClean,
		cart: newUserCart,
	});

	if (updatedUserCart.data.type === 'error') {
		return updatedUserCart;
	}

	return new Promise((resolve) =>
		resolve(
			responseHandler({
				uniqueCodeData: uniqueCodes.itemAddedToCart,
				data: { type: 'success', payload: updatedUserCart.data.payload },
				functionName: 'addItemToCart',
			})
		)
	);
};

const removeItemFromCart = async (contextObject: {
	userId: string;
	body: { itemId: string; outletId: string };
}): Promise<IResponseMessage> => {
	const { userId, body } = contextObject;

	if (!userId || !userId.trim()) {
		return new Promise((resolve) =>
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.invalidUserId,
					functionName: 'addItemToCart',
					data: { type: 'error', payload: null },
				})
			)
		);
	}

	const { itemId, outletId } = body;

	const checkItemAvailability: IResponseMessage = await isItemAvailable({
		itemId,
	});

	if (checkItemAvailability.data.type === 'error') {
		return checkItemAvailability;
	}

	const item = checkItemAvailability.data.payload as Record<string, unknown>;

	if (item.outletId !== outletId) {
		return new Promise((resolve) =>
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.unprocessable,
					data: { type: 'error', payload: null },
					functionName: 'addItemToCart',
				})
			)
		);
	}

	const currentUserCartData: IResponseMessage = await getUserCart({ userId });

	if (currentUserCartData.data.type === 'error') {
		return currentUserCartData;
	}

	const userCart = currentUserCartData.data.payload as UserCartType;

	const newUserCart: UserCartType = userCart;

	if (userCart.length === 0) {
		newUserCart.push({
			itemId,
			quantity: 1,
			outletId,
		});
	} else {
		// check if all the outlet ids are same and equal to new outlet id
		if (userCart[userCart.length - 1].outletId !== outletId) {
			return new Promise((resolve) =>
				resolve(
					responseHandler({
						uniqueCodeData: uniqueCodes.unprocessable,
						data: { type: 'error', payload: null },
						functionName: 'addItemToCart',
					})
				)
			);
		}

		// increase the quantity if the item exists already

		const itemIds = userCart.map((i) => i.itemId);

		if (itemIds.includes(itemId)) {
			itemIds.forEach((i, j) => {
				if (i === itemId) {
					newUserCart[j].quantity += 1;
				}
			});
		} else {
			newUserCart.push({
				itemId,
				outletId,
				quantity: 1,
			});
		}
	}

	const updatedUserCart: IResponseMessage = await updateCartHelper({
		userId,
		cart: newUserCart,
	});

	if (updatedUserCart.data.type === 'error') {
		return updatedUserCart;
	}

	return new Promise((resolve) =>
		resolve(
			responseHandler({
				uniqueCodeData: uniqueCodes.itemAddedToCart,
				data: { type: 'success', payload: updatedUserCart.data.payload },
				functionName: 'addItemToCart',
			})
		)
	);
};

const clearUserCart = async (contextObj: {
	userId: string;
}): Promise<IResponseMessage> => {};

export { getUserCart, addItemToCart, removeItemFromCart, clearUserCart };
