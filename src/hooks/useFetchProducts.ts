import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/products/productsSlice";
import { RootState } from "../app/store";

export const useFetchProducts = (page: number) => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector(
    (state: RootState) => state.products
  );

  useEffect(() => {
    dispatch(fetchProducts(page) as any);
  }, [dispatch, page]);

  return { list, loading, error };
};
