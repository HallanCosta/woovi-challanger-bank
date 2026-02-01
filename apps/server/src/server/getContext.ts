import { getDataloaders } from '../modules/loader/loaderRegister';

export interface GraphQLContext {
	dataloaders: ReturnType<typeof getDataloaders>;
}

const getContext = () => {
	const dataloaders = getDataloaders();

	return {
		dataloaders,
	} as const;
};

export { getContext };
