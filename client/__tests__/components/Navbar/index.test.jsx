import { render } from '@testing-library/react';

import Navbar from '@components/ui/Navbar';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('Navbar Component', () => {
  test('Correct render', () => {
    const navbar = render(<Navbar title="Title" locale="en" theme="light" />);
    expect(navbar.getByTestId('navbar')).toBeInTheDocument();
  });

  test('Should match with snapshot', () => {
    const navbar = render(<Navbar title="Title" locale="en" theme="light" />);
    expect(navbar).toMatchSnapshot();
  });

  test('Displays ProfileMenu when user is present', () => {
    const userMock = { name: 'Test User', email: 'test@example.com' };
    const { getByText } = render(<Navbar user={userMock} />);

    expect(getByText('Test User')).toBeInTheDocument();
  });
});
