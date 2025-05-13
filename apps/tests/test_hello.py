"""Hello unit test module."""

from fast_f1_service.hello import hello


def test_hello():
    """Test the hello function."""
    assert hello() == "Hello fast_f1_service"
