import { useMemo } from 'react';
import { sortBy } from 'lodash';
import { SessionState } from '@src/core/store/reducer/session/types';
import { useSelector } from 'react-redux';
import { AppState } from '@src/core/store';
import { ColumnContent } from '@src/core/models/type';

export default function useColumns() {
  const { session }: SessionState = useSelector((state: AppState) => state.session);
  const posts = session ? session.posts : [];
  const groups = session ? session.groups : [];
  const cols = session ? session.columns : [];

  const columns: ColumnContent[] = useMemo(
    () =>
      cols
        .map(
          (col, index) =>
            ({
              index,
              posts: sortBy(
                posts.filter(p => p.column === index && p.group === null),
                p => p.rank
              ),
              groups: groups
                .filter(p => p.column === index)
                .map(group => ({
                  ...group,
                  posts: sortBy(
                    posts.filter(p => !!p.group && p.group.id === group.id),
                    p => p.rank
                  ),
                })),
              ...col,
            } as ColumnContent)
        ),
    [posts, groups, cols]
  );
  return columns;
}
