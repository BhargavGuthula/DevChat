import {Navigate} from 'react-router-dom';
function ProtectedRoute({children}){
    const user = JSON.parse(localStorage.getItem('devchatUser'));
    if(!user){
        return(
            <Navigate to='/'/>
        );
    }
    return children;
}
export default ProtectedRoute;