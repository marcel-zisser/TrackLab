"""Hello unit test module."""

from tracklab.copilot.copilot import get_segment_data
from __generated__.copilot_pb2 import QualifyingRequest 

def test_get_segmant_data():
    """Test the get_segment_data function."""
    request = QualifyingRequest(year=2025, round=1, segment='Q1')

    segment_data = get_segment_data(request)

    assert len(segment_data) > 0