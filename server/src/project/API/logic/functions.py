def get_data(request):
    if 'multipart/form-data' in request.content_type:
        return request.POST.dict()
    elif 'application/json' in request.content_type:
        return request.data
    else:
        return request.POST.dict()