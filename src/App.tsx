// import classNames from 'classnames';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './App.scss';

import { PostsList } from './components/PostsList';
// import { PostDetails } from './components/PostDetails';

import { getUsers } from './servises/user';
import { UserSelector } from './components/UserSelector';
import { useEffect, useState } from 'react';
import { User } from './types/User';
import { Post } from './types/Post';
import { getPosts } from './servises/post';
import { Loader } from './components/Loader';

export const App = () => {
  const [users, setUsers] = useState<User[] | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const showNoPost =
    selectedUser && !isLoading && !error && posts && posts.length === 0;

  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  useEffect(() => {
    if (selectedUser) {
      setIsLoading(true);
      setError(false);
      setPosts(null);

      getPosts(selectedUser.id)
        .then(setPosts)
        .catch(loadingError => {
          setError(true);

          throw loadingError;
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [selectedUser]);

  return (
    <main className="section">
      <div className="container">
        <div className="tile is-ancestor">
          <div className="tile is-parent">
            <div className="tile is-child box is-success">
              <div className="block">
                {users && (
                  <UserSelector
                    usersList={users}
                    selectedUser={selectedUser}
                    onSelectUser={setSelectedUser}
                  />
                )}
              </div>

              <div className="block" data-cy="MainContent">
                {!selectedUser && (
                  <p data-cy="NoSelectedUser">No user selected</p>
                )}

                {isLoading && <Loader />}

                {!isLoading && error && (
                  <div
                    className="notification is-danger"
                    data-cy="PostsLoadingError"
                  >
                    Something went wrong!
                  </div>
                )}

                {showNoPost && (
                  <div className="notification is-warning" data-cy="NoPostsYet">
                    No posts yet
                  </div>
                )}

                {selectedUser &&
                  !isLoading &&
                  !error &&
                  posts &&
                  posts.length > 0 && <PostsList posts={posts} />}

                {/* {!selectedUser ? (
                  <p data-cy="NoSelectedUser">No user selected</p>
                ) : (
                  <>
                    {isLoading ? (
                      <Loader />
                    ) : (
                      <>
                        {error ? (
                          <div
                            className="notification is-danger"
                            data-cy="PostsLoadingError"
                          >
                            Something went wrong!
                          </div>
                        ) : (
                          <>
                            {!posts || posts.length === 0 ? (
                              <div
                                className="notification is-warning"
                                data-cy="NoPostsYet"
                              >
                                No posts yet
                              </div>
                            ) : (
                              <PostsList posts={posts} />
                            )}
                          </>
                        )}
                      </>
                    )}
                  </>
                )} */}
              </div>
            </div>
          </div>

          {/* <div
            data-cy="Sidebar"
            className={classNames(
              'tile',
              'is-parent',
              'is-8-desktop',
              'Sidebar',
              'Sidebar--open',
            )}
          >
            <div className="tile is-child box is-success ">
              <PostDetails />
            </div>
          </div> */}
        </div>
      </div>
    </main>
  );
};
