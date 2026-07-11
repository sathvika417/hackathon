from app.predict import predictor


def test_list_occupations_handles_missing_occupation_names():
    predictor.dataset = None
    predictor.model = None
    predictor.imputer = None
    predictor.selected_features = []
    predictor.occupation_index = {}

    occupations = predictor.list_occupations()

    assert occupations
    assert all(isinstance(item.title, str) and item.title for item in occupations)
    assert any(item.title == "Computer and Information Systems Managers" for item in occupations)
