import json


def get_data(request):
    if 'multipart/form-data' in request.content_type:
        return request.POST.dict()
    elif 'application/json' in request.content_type:
        return json.loads(request.body)
    else:
        return request.POST.dict()