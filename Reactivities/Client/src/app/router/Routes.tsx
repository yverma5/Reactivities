import { createBrowserRouter, Navigate } from "react-router";
import App from "../layout/App";
import HomePage from "../../feature/home/HomePage";
import ActivityForm from "../../feature/activities/form/ActivityForm";
import ActivityDetailsPage from "../../feature/activities/details/ActivityDetailsPage";
import ActivityDashboard from "../../feature/activities/dashboard/ActivityDashboard";
import NotFound from "../../feature/errors/NotFound";
import ServerError from "../../feature/errors/ServerError";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { path: '', element: <HomePage /> },
            { path: 'activities', element: <ActivityDashboard /> },
            { path: 'activities/:id', element: <ActivityDetailsPage /> },
            { path: 'createActivity', element: <ActivityForm key='create' /> },
            { path: 'manage/:id', element: <ActivityForm /> },
            { path: 'not-found', element: <NotFound /> },
            { path: 'serve-error', element: <ServerError /> },
            { path: '*', element: <Navigate replace to='not-found'/> },



        ]
    }
])