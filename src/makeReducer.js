import { updateStatePathWithReducer } from './paths';
import { getActionMapping } from './actionMapping';

const mapping = action => getActionMapping(action.type);
export default reducer =>
  (state, action) =>
    mapping(action)
      ? updateStatePathWithReducer({
          state,
          path: mapping(action).path,
          reducer: mapping(action).reducer,
          action
        })
      : reducer(state, action);
