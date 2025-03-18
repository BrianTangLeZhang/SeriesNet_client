import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CookiesProvider } from "react-cookie";
import Home from "./pages/home";
import PostNew from "./pages/PostNew";
import LoginPage from "./pages/Login";
import UsersPage from "./pages/Users";
import RegisterPage from "./pages/Register";
import UserProfile from "./pages/UserProfile";
import AnimePage from "./pages/Series";
import PostEdit from "./pages/PostEdit";
import AnimeNew from "./pages/SeriesNew";
import AnimeDetail from "./pages/SeriesDetailPage";
import AnimeEdit from "./pages/SeriesEdit";       
import WatchingPage from "./pages/WatchingPage";
import UserFavouriteList from "./pages/List";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CookiesProvider def>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route path="/" element={<Home />} />
            <Route path="/addPost" element={<PostNew />} />
            <Route path="/editPost/:id" element={<PostEdit />} />

            <Route path="/series" element={<AnimePage />} />
            <Route path="/series/:id" element={<AnimeDetail />} />
            <Route path="/addSeries" element={<AnimeNew />} />
            <Route path="/editSeries/:id" element={<AnimeEdit />} />

            <Route path="/episode/:id" element={<WatchingPage />} />
            <Route path="/lists" element={<UserFavouriteList />} />

            <Route path="/users/:id" element={<UserProfile />} />
            <Route path="/users" element={<UsersPage />} />
          </Routes>
        </BrowserRouter>
      </CookiesProvider>
    </QueryClientProvider>
  );
}
