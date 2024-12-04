from rest_framework import serializers
from .models import Plot, Bed, Plant

class PlotPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plot
        fields = ['title']

    def validate_title(self, value):
        user = self.context['user']
        if user.plot_set.filter(title=value).exists():
            raise serializers.ValidationError('Участок с таким именем существует')
        return value

    
class PlotGetSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    title = serializers.CharField(allow_null=True, required=False)

    class Meta:
        model = Plot
        fields = ['id', 'user_name', 'title']

    def get_user_name(self, obj):
        return obj.user.username
    
class BedListSerializer(serializers.ModelSerializer):
    plant = serializers.StringRelatedField()
    plot = serializers.StringRelatedField()

    class Meta:
        model = Bed
        fields = ['id', 'plot', 'plant', 'group', 'wet']
    
class NewBedSerializer(serializers.ModelSerializer):
    plant = serializers.CharField(required=False, allow_null=True)
    group = serializers.CharField(max_length=255, required=False, allow_null=True)
    wet = serializers.BooleanField(required=False, allow_null=True)

    class Meta:
        model = Bed
        fields = ['plant', 'group', 'wet']

    def validate_plant(self, value):
        if value and not Plant.objects.filter(title=value).exists():
            raise serializers.ValidationError(f'Растение {value} не найдено')
        return value
    
    def create(self, validated_data):
        plot = self.context['plot']
        
        plant = None
        if validated_data.get('plant'):
            plant = Plant.objects.get(title=validated_data['plant'])
        
        group = 0
        if validated_data.get('group'):
            group = validated_data['group']
        
        wet = 0
        if validated_data.get('wet'):
            wet = validated_data['wet']

        return Bed.objects.create(
            plot=plot,
            plant=plant,
            group=group,
            wet=wet
        )
