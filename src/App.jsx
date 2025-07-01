import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { FooterProvider } from './contexts/FooterContext';

import Index from './pages/Index';
import Products from './pages/products/Products';
import Sample from './pages/Sample';

import ChatListPage from './pages/Chat/ChatListPage';
import MessageRoom from './pages/Chat/MessageRoom';
import FollowListPage from './pages/Profile/FollowListPage';
import ProfileEditPage from './pages/Profile/ProfileEditPage';
import ProfilePage from './pages/Profile/ProfilePage';

import Footer from './components/Footer';
import Page404 from './pages/Page404';
import CreatePost from './pages/post/CreatePost';
import Post from './pages/post/Post';

import LoginMain from './pages/login/LoginMain';
import EmailLoginPage from './pages/login/EmailLoginPage'; 
import SignupPage from './pages/login/SignupPage';
import SignupProfilePage from './pages/login/SignupProfilePage';
import { UserProvider } from './contexts/userContext';

function App() {
  return (
    <UserProvider>
      <BrowserRouter basename="/gamgyul-social-market">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/product/create" element={<Products />} />
          <Route path="/product/update/:id" element={<Products />} />
          <Route path="/post/:id" element={<Post />} />
          <Route path="/post/create" element={<CreatePost />} />
          <Route path="/sample" element={<Sample />} />

          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/edit" element={<ProfileEditPage />} />
          <Route path="/profile/:accountname" element={<ProfilePage />} />
          <Route
            path="/profile/:accountname/followers"
            element={<FollowListPage />}
          />
          <Route
            path="/profile/:accountname/followings"
            element={<FollowListPage />}
          />
          <Route path="/chat" element={<ChatListPage />} />
          <Route path="/chat/:chatId" element={<MessageRoom />} />
          
          <Route path="*" element={<Page404 />} />

          <Route path='/login/signup' element={<SignupPage />} />
          <Route path='/login/signup/profile' element={<SignupProfilePage />} />
          <Route path='/login' element={<LoginMain />} />
          <Route path='/login/email' element={<EmailLoginPage />} />
        </Routes>
        <FooterProvider>
          <Footer />
        </FooterProvider>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
