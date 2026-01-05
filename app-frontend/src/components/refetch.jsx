import { useDispatch } from 'react-redux';
import { fetchBootstrapData } from '../store/slices/bootstrapSlice';

const dispatch = useDispatch();
await dispatch(fetchBootstrapData(makeAuthenticatedRequest));
