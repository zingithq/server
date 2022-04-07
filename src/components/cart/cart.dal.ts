import uniqueCodes from '../../constants/uniqueCodes';
import IItemModel from '../../types/IItemModel';
import IOutletModel from '../../types/IOutletModel';
import IResponseMessage from '../../types/IResponseMessage';
import TUserCart from '../../types/TUserCart';
import responseHandler from '../../utils/responseHandler';
import { isItemAvailable } from '../item/item.dal';
import { getOutletDetails } from '../outlet/outlet.dal';
import User from '../user/user.model';

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
		const userCart = await User.findById(userIdClean).select('userCart');

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
	cart: TUserCart;
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

	let cleanCart: TUserCart = cart;

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

		// check if all outletIds are same
		const outletIds = cart.map((item) => item.outletId);
		const outletIdsSet = new Set(outletIds);
		if (outletIdsSet.size !== 1) {
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

		cleanCart = cart.map((item) => ({
			itemId: item.itemId.trim(),
			outletId: item.outletId.trim(),
			quantity: item.quantity,
		}));
	}

	// update cart object in mongoose
	try {
		const finalUpdatedUserCart = await User.findByIdAndUpdate(
			userIdClean,
			{
				$set: {
					cart: cleanCart,
				},
			},
			{ new: true }
		).select('cart');

		if (!finalUpdatedUserCart) {
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
					data: { type: 'success', payload: finalUpdatedUserCart },
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

	const checkOutletAvailability: IResponseMessage = await getOutletDetails({
		outletId: outletIdClean,
	});

	if (checkOutletAvailability.data.type === 'error') {
		return checkOutletAvailability;
	}

	const outletData = checkOutletAvailability.data.payload as IOutletModel;
	if (!outletData.isOutletActive) {
		return new Promise((resolve) =>
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.outletNotActive,
					functionName: 'addItemToCart',
					data: { type: 'error', payload: null },
				})
			)
		);
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

	const userCart = currentUserCartData.data.payload as TUserCart;

	const newUserCart: TUserCart = userCart;

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
	body: { itemId: string };
}): Promise<IResponseMessage> => {
	const { userId, body } = contextObject;

	if (!userId || !userId.trim()) {
		return new Promise((resolve) =>
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.invalidUserId,
					functionName: 'removeItemFromCart',
					data: { type: 'error', payload: null },
				})
			)
		);
	}

	const userIdClean = userId.trim();

	const { itemId } = body;

	if (!itemId || !itemId.trim()) {
		return new Promise((resolve) =>
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.invalidItemId,
					functionName: 'removeItemFromCart',
					data: { type: 'error', payload: null },
				})
			)
		);
	}

	const itemIdClean = itemId.trim();

	const currentUserCartData: IResponseMessage = await getUserCart({
		userId: userIdClean,
	});

	if (currentUserCartData.data.type === 'error') {
		return currentUserCartData;
	}

	const userCart = currentUserCartData.data.payload as TUserCart;

	const newUserCart: TUserCart = userCart;

	if (userCart.length === 0) {
		return new Promise((resolve) =>
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.unprocessable,
					data: { type: 'error', payload: null },
					functionName: 'removeItemFromCart',
				})
			)
		);
	}

	// decrease the quantity if the current quantity>1 else remove entire object from cart

	const itemIds = userCart.map((i) => i.itemId);

	if (itemIds.includes(itemIdClean)) {
		itemIds.forEach((i, j) => {
			if (i === itemId) {
				if (userCart[j].quantity > 1) {
					newUserCart[j].quantity -= 1;
				} else {
					newUserCart.splice(j, 1);
				}
			}
		});
	} else {
		return new Promise((resolve) =>
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.unprocessable,
					data: { type: 'error', payload: null },
					functionName: 'removeItemFromCart',
				})
			)
		);
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
				uniqueCodeData: uniqueCodes.itemRemovedFromCart,
				data: { type: 'success', payload: updatedUserCart.data.payload },
				functionName: 'removeItemFromCart',
			})
		)
	);
};

const clearUserCart = async (contextObj: {
	userId: string;
}): Promise<IResponseMessage> => {
	const { userId } = contextObj;

	if (!userId || !userId.trim()) {
		return new Promise((resolve) =>
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.invalidUserId,
					functionName: 'clearUserCart',
					data: { type: 'error', payload: null },
				})
			)
		);
	}

	const cleanUserId: string = userId.trim();

	const newUserCart: TUserCart = [];

	const updatedUserCart: IResponseMessage = await updateCartHelper({
		userId: cleanUserId,
		cart: newUserCart,
	});

	if (updatedUserCart.data.type === 'error') {
		return updatedUserCart;
	}

	return new Promise((resolve) =>
		resolve(
			responseHandler({
				uniqueCodeData: uniqueCodes.cartCleared,
				data: { type: 'success', payload: updatedUserCart.data.payload },
				functionName: 'clearUserCart',
			})
		)
	);
};

export { getUserCart, addItemToCart, removeItemFromCart, clearUserCart };
