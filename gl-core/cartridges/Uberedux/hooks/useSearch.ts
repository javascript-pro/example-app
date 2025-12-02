// /Users/goldlabel/GitHub/example-app/gl-core/cartridges/Uberedux/hooks/useSearch.ts

import { useSelector } from 'react-redux';
import { TRootState } from '../../Uberedux/store';

export function useSearch() {
  return useSelector((state: TRootState) => state.redux.search);
}
