from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.db.models import Q

from auth_api.models import User
from .models import Plant, Plot, Bed
from .serializer import PlotGetSerializer, PlotPostSerializer, BedListSerializer, NewBedSerializer

class NewPlot(APIView):
    permission_classes = (IsAuthenticated, )

    def post(self, request, user_id):
        user = User.objects.get(id=user_id)
        serializer = PlotPostSerializer(data=request.data, context={'user':user})

        if serializer.is_valid():
            plot = Plot.objects.create(user=user, title=serializer.validated_data['title'])
            data = {
                'message': 'Участок создан',
                'title': plot.title,
            }
            return Response(data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class PlotList(APIView):
    permission_classes = (IsAuthenticated, )

    def get(self, request, user_id):
        user = User.objects.get(id=user_id)
        plots = user.plot_set.all()
        serializer = PlotGetSerializer(plots, many=True)

        return Response(serializer.data)
        

class NewBed(APIView):
    permission_classes = (IsAuthenticated, )

    def post(self, request, plot_id):
        plot = Plot.objects.get(id=plot_id)
        serializer = NewBedSerializer(data=request.data, context={'plot': plot})

        if serializer.is_valid():
            bed = serializer.save()  # Создаем грядку через сериализатор
            data = {
                'message': 'Грядка сделана!',
                'plot': bed.plot.title,
                'group': bed.group,
                'wet': bed.wet,
            }
            return Response(data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class BedList(APIView):
    permission_classes = (IsAuthenticated, )

    def get(self, request, plot_id):
        plot = Plot.objects.get(id=plot_id)
        beds = plot.bed_set.all()
        serializer = BedListSerializer(beds, many=True)
        return Response(serializer.data)