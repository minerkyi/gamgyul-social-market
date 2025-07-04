import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { FooterProvider } from './contexts/FooterContext';
import { ProfileRefetchProvider } from './contexts/ProfileRefetchContext';
import { UserProvider } from './contexts/userContext';

import Products from './pages/products/Products';
import Sample from './pages/Sample';

import ChatListPage from './pages/Chat/ChatListPage';
import MessageRoom from './pages/Chat/MessageRoom';
import FollowListPage from './pages/Profile/FollowListPage';
import ProfileEditPage from './pages/Profile/ProfileEditPage';
import ProfilePage from './pages/Profile/ProfilePage';
import SearchPage from './pages/Search/SearchPage';

import Footer from './components/Footer';
import Page404 from './pages/Page404';
import CreatePost from './pages/post/CreatePost';
import Post from './pages/post/Post';

import RequireLogin from './components/RequireLogin';
import HomeFeed from './pages/home/HomeFeed';
import EmailLoginPage from './pages/login/EmailLoginPage';
import LoginMain from './pages/login/LoginMain';
import SignupPage from './pages/login/SignupPage';
import SignupProfilePage from './pages/login/SignupProfilePage';
import Splash from './pages/Splash';

function App() {
  return (
    <UserProvider>
      <ProfileRefetchProvider>
        <BrowserRouter basename="/gamgyul-social-market">
          <Routes>
            <Route path="/" element={<Splash />} />
            <Route
              path="/home"
              element={
                <RequireLogin>
                  <HomeFeed />
                </RequireLogin>
              }
            />
            <Route path="/search" element={<SearchPage />} />
            <Route
              path="/product/create"
              element={
                <RequireLogin>
                  <Products />
                </RequireLogin>
              }
            />
            <Route
              path="/product/update/:id"
              element={
                <RequireLogin>
                  <Products />
                </RequireLogin>
              }
            />
            <Route
              path="/post/comments/:id"
              element={
                <RequireLogin>
                  <Post />
                </RequireLogin>
              }
            />
            <Route
              path="/post/create"
              element={
                <RequireLogin>
                  <CreatePost />
                </RequireLogin>
              }
            />
            <Route
              path="/post/update/:id"
              element={
                <RequireLogin>
                  <CreatePost />
                </RequireLogin>
              }
            />
            <Route path="/sample" element={<Sample />} />
            <Route
              path="/profile"
              element={
                <RequireLogin>
                  <ProfilePage />
                </RequireLogin>
              }
            />
            <Route
              path="/profile/edit"
              element={
                <RequireLogin>
                  <ProfileEditPage />
                </RequireLogin>
              }
            />
            <Route
              path="/profile/:accountname"
              element={
                <RequireLogin>
                  <ProfilePage />
                </RequireLogin>
              }
            />
            <Route
              path="/profile/:accountname/followers"
              element={
                <RequireLogin>
                  <FollowListPage />
                </RequireLogin>
              }
            />
            <Route
              path="/profile/:accountname/followings"
              element={
                <RequireLogin>
                  <FollowListPage />
                </RequireLogin>
              }
            />
            <Route
              path="/chat"
              element={
                <RequireLogin>
                  <ChatListPage />
                </RequireLogin>
              }
            />
            <Route
              path="/chat/:chatId"
              element={
                <RequireLogin>
                  <MessageRoom />
                </RequireLogin>
              }
            />
            <Route path="*" element={<Page404 />} />
            <Route path="/login/signup" element={<SignupPage />} />
            <Route
              path="/login/signup/profile"
              element={<SignupProfilePage />}
            />
            <Route path="/login" element={<LoginMain />} />
            <Route path="/login/email" element={<EmailLoginPage />} />
          </Routes>
          <FooterProvider>
            <Footer />
          </FooterProvider>
        </BrowserRouter>
      </ProfileRefetchProvider>
    </UserProvider>
  );
}

export default App;
