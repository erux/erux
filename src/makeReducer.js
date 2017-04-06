import { updateStatePathWithReducer } from './paths';
import { getActionMapping, getInitialState } from './actionMapping';

const mapping = action => getActionMapping(action.type);
export default reducer =>
  (state, action) =>
    reducer(
      (mapping(action) || []).reduce(
        (currentState, { path, reducer }) =>
          updateStatePathWithReducer({
            state: currentState,
            path,
            reducer,
            action
          }),
        state || getInitialState()
      ),
      action
    );