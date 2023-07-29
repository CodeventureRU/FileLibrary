from rest_framework.views import exception_handler
from rest_framework.exceptions import Throttled


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if isinstance(exc, Throttled):
        custom_response_data = {
            'detail': ('Превышено количество запросов'),
            'remains': exc.wait
        }
        response.data = custom_response_data  # set the custom response data on response object

    return response
