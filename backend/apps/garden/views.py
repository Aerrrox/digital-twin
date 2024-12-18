from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.db.models import Q
from django.utils import timezone
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator

from users.models import User
from .models import Plant, Plot, Bed
from .serializer import (
    PlotGetSerializer, PlotPostSerializer, BedListSerializer, NewBedSerializer,
    PlotPostSerializer, BedUpdateSerializer, PlantSerializer, )

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
    
class UpdatePlot(APIView):
    permission_classes = (IsAuthenticated, )

    def put(self, request, plot_id):
        try:
            # Получаем участок по ID
            plot = Plot.objects.get(id=plot_id, user=request.user)
        except Plot.DoesNotExist:
            return Response({"error": "Участок не найден или недоступен"}, status=status.HTTP_404_NOT_FOUND)

        # Передаём данные в сериализатор для валидации
        serializer = PlotPostSerializer(plot, data=request.data, partial=True, context={'user': request.user})
        if serializer.is_valid():
            serializer.save()  # Сохраняем обновлённые данные
            return Response({'message': 'Участок обновлён', 'title': serializer.data['title']}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class DeletePlot(APIView):
    permission_classes = (IsAuthenticated, )

    def delete(self, request, plot_id):
        try:
            # Проверяем, что участок принадлежит текущему пользователю
            plot = Plot.objects.get(id=plot_id, user=request.user)
            plot.delete()  # Удаляем участок
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Plot.DoesNotExist:
            return Response({"error": "Участок не найден или недоступен"}, status=status.HTTP_404_NOT_FOUND)
        
class UpdateBed(APIView):
    permission_classes = (IsAuthenticated, )

    def put(self, request, bed_id):
        try:
            # Проверяем, что грядка принадлежит текущему пользователю через участок
            bed = Bed.objects.get(id=bed_id, plot__user=request.user)
        except Bed.DoesNotExist:
            return Response({"error": "Грядка не найдена или недоступна"}, status=status.HTTP_404_NOT_FOUND)

        # Создаём сериализатор для обновления данных
        serializer = BedUpdateSerializer(bed, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "Грядка обновлена",
                "group": serializer.data['group'],
                "wet": serializer.data['wet'],
                "info": serializer.data['info'],
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class DeleteBed(APIView):
    permission_classes = (IsAuthenticated, )

    def delete(self, request, bed_id):
        try:
            # Проверяем, что грядка принадлежит текущему пользователю через участок
            bed = Bed.objects.get(id=bed_id, plot__user=request.user)
            bed.delete()  # Удаляем грядку
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Bed.DoesNotExist:
            return Response({"error": "Грядка не найдена или недоступна"}, status=status.HTTP_404_NOT_FOUND)
        
class AddPlant(APIView):
    permission_classes = (IsAuthenticated, )

    def post(self, request, bed_id):
        try:
            # Проверяем, что грядка принадлежит текущему пользователю через участок
            bed = Bed.objects.get(id=bed_id, plot__user=request.user)
            if bed.plant:
                return Response({"error": "В грядке уже есть растение"}, status=status.HTTP_400_BAD_REQUEST)

            plant_title = request.data.get('plant')
            plant = Plant.objects.get(title=plant_title)
            
            # Обновляем грядку с новым растением
            bed.plant = plant
            bed.save()

            return Response({
                "message": "Растение добавлено",
                "plant": plant.title,
            }, status=status.HTTP_200_OK)
        except Bed.DoesNotExist:
            return Response({"error": "Грядка не найдена"}, status=status.HTTP_404_NOT_FOUND)
        except Plant.DoesNotExist:
            return Response({"error": f"Растение '{plant_title}' не найдено"}, status=status.HTTP_400_BAD_REQUEST)

        
class BedPlant(APIView):
    permission_classes = (IsAuthenticated, )

    def get(self, request, bed_id):
        try:
            # Проверяем, что грядка принадлежит текущему пользователю через участок
            bed = Bed.objects.get(id=bed_id, plot__user=request.user)
            if not bed.plant:
                return Response({"message": "Растение не добавлено"}, status=status.HTTP_404_NOT_FOUND)

            serializer = PlantSerializer(bed.plant)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Bed.DoesNotExist:
            return Response({"error": "Грядка не найдена"}, status=status.HTTP_404_NOT_FOUND)
        
class PlantList(APIView):
    permission_classes = (IsAuthenticated, )  # Доступ только для авторизованных пользователей

    @method_decorator(cache_page(60))  # Кэш на 60 секунд
    def get(self, request):
        try:
            plants = Plant.objects.all()
            serializer = PlantSerializer(plants, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
from django.utils.timezone import now

class WaterBed(APIView):
    permission_classes = (IsAuthenticated,)  # Только авторизованные пользователи

    def post(self, request, bed_id):
        try:
            # Ищем грядку, связанную с текущим пользователем
            bed = Bed.objects.get(id=bed_id, plot__user=request.user)

            # Проверяем, есть ли растение на грядке
            if not bed.plant:
                return Response({"error": "На грядке нет растений для полива"}, status=status.HTTP_400_BAD_REQUEST)

            # Обновляем данные грядки
            bed.last_watered = now()
            bed.wet = 100  # Устанавливаем максимальную влажность
            bed.save()

            return Response({"message": "Грядка успешно полита"}, status=status.HTTP_200_OK)

        except Bed.DoesNotExist:
            return Response({"error": "Грядка не найдена или недоступна"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class BedStatus(APIView):
    permission_classes = (IsAuthenticated, )

    def get(self, request, bed_id):
        try:
            # Получаем грядку текущего пользователя
            bed = Bed.objects.get(id=bed_id, plot__user=request.user)
            status_bed = "увядшая" if bed.is_wilted else "здоровая"
            last_watered = bed.last_watered.strftime("%Y-%m-%d %H:%M") if bed.last_watered else "Никогда"
            return Response({
                "id": bed.id,
                "status": status_bed,
                "last_watered": last_watered
            }, status=status.HTTP_200_OK)
        except Bed.DoesNotExist:
            return Response({"error": "Грядка не найдена или недоступна"}, status=status.HTTP_404_NOT_FOUND)
        
class RemovePlant(APIView):
    permission_classes = (IsAuthenticated, )

    def delete(self, request, bed_id):
        try:
            # Проверяем, что грядка принадлежит текущему пользователю
            bed = Bed.objects.get(id=bed_id, plot__user=request.user)
            
            if not bed.plant:
                return Response({"message": "На грядке уже нет растения"}, status=status.HTTP_200_OK)
            
            # Удаляем растение из грядки
            bed.plant = None
            bed.save()

            return Response({"message": "Растение успешно удалено с грядки"}, status=status.HTTP_200_OK)
        except Bed.DoesNotExist:
            return Response({"error": "Грядка не найдена или недоступна"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class BedsInGroup(APIView):
    permission_classes = (IsAuthenticated, )

    def get(self, request, group_id):
        try:
            # Фильтруем грядки по группе и текущему пользователю
            beds = Bed.objects.filter(plot__user=request.user, group=group_id)
            serializer = BedListSerializer(beds, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class ChangeBedGroup(APIView):
    permission_classes = (IsAuthenticated, )

    def patch(self, request, bed_id):
        try:
            # Получаем грядку текущего пользователя
            bed = Bed.objects.get(id=bed_id, plot__user=request.user)
            new_group = request.data.get('group')

            # Проверяем, что новая группа корректна
            if not isinstance(new_group, int) or new_group < 0:
                return Response({"error": "Группа должна быть положительным числом"}, status=status.HTTP_400_BAD_REQUEST)

            # Обновляем группу
            bed.group = new_group
            bed.save()
            return Response({"message": "Группа грядки успешно обновлена", "group": bed.group}, status=status.HTTP_200_OK)

        except Bed.DoesNotExist:
            return Response({"error": "Грядка не найдена или недоступна"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class WaterBedsInGroup(APIView):
    permission_classes = (IsAuthenticated, )

    def post(self, request, group_id):
        try:
            # Получаем все грядки в группе, принадлежащие пользователю
            beds = Bed.objects.filter(plot__user=request.user, group=group_id)

            if not beds.exists():
                return Response({"message": "В этой группе нет грядок"}, status=status.HTTP_200_OK)

            # Поливаем грядки: обновляем поля wet и last_watered
            for bed in beds:
                bed.wet = 100
                bed.last_watered = timezone.now()
                bed.save()

            return Response({"message": "Все грядки в группе политые"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ResetGroup(APIView):
    permission_classes = (IsAuthenticated, )

    def delete(self, request, group_id):
        try:
            # Получаем все грядки в указанной группе и текущего пользователя
            beds = Bed.objects.filter(plot__user=request.user, group=group_id)

            if not beds.exists():
                return Response({"message": "В этой группе нет грядок"}, status=status.HTTP_200_OK)

            # Сбрасываем номер группы
            beds.update(group=0)

            return Response({"message": "Группа успешно сброшена"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
