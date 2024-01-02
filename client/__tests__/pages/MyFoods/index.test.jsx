import MyFoods from '@pages/MyFoods';
import { render } from '@utils/testHelper';

let wrapper;

beforeEach(() => {
  wrapper = render(<MyFoods />);
});

describe('NotFound page', () => {
  it('should render the page correctly', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('my-foods')).toBeInTheDocument();
  });

  it('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
