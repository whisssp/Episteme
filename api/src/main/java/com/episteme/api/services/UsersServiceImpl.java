package com.episteme.api.services;

import com.episteme.api.entity.Users;
import com.episteme.api.entity.dto.AuthorDto;
import com.episteme.api.entity.dto.UsersDto;
import com.episteme.api.exceptions.DuplicateRecordException;
import com.episteme.api.exceptions.ApiResponse;
import com.episteme.api.exceptions.NotFoundException;
import com.episteme.api.repository.UsersRepository;
import com.episteme.api.response.UserResponse;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.nio.ByteBuffer;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UsersServiceImpl implements UsersService {
    @Autowired
    private UsersRepository usersRepository;
    @Autowired
    private ModelMapper modelMapper;
    public static String shortUUID() {
        UUID uuid = UUID.randomUUID();
        long l = ByteBuffer.wrap(uuid.toString().getBytes()).getLong();
        return Long.toString(l, Character.MAX_RADIX);
    }

    @Override
    public UsersDto save(UsersDto usersDto) {
        try {
            Users users = this.dtoToUsers(usersDto);
            users.setUserId(shortUUID());
            Users saveUsers = this.usersRepository.save(users);
            return this.usersToDto(saveUsers);
        } catch (DataIntegrityViolationException ex) {
            ApiResponse<UsersDto> apiResponse = new ApiResponse<>(HttpStatus.CONFLICT, "Duplicate record: " + ex.getMessage());
            throw new DuplicateRecordException(apiResponse.getMessage());
        }
    }

    public UsersDto saveResp(UsersDto usersDto) {
        try {
            Users users = this.dtoToUsers(usersDto);
            Users saveUsers = this.usersRepository.save(users);
            return this.usersToDto(saveUsers);
        } catch (DataIntegrityViolationException ex) {
            ApiResponse<UsersDto> apiResponse = new ApiResponse<>(HttpStatus.CONFLICT, "Duplicate record: " + ex.getMessage());
            throw new DuplicateRecordException(apiResponse.getMessage());
        }
    }

    @Override
    public UsersDto update(UsersDto usersDto, String id) {
        Users users = this.usersRepository.findById(id).orElseThrow(() -> new NotFoundException("Không tìm thấy User Id: " + id));
        users.setEmail(usersDto.getEmail());
        users.setPassword(usersDto.getEmail());
        users.setBirthday(usersDto.getBirthday());
        users.setDescription(usersDto.getDescription());
        Users updateUser =usersRepository.save(users);
        return this.modelMapper.map(updateUser,UsersDto.class);
    }

    @Override
    public void delete(String id) {
        Users users = this.usersRepository.findById(id).orElseThrow(() -> new NotFoundException("Không tìm thấy User Id: " + id));
        this.usersRepository.delete(users);
    }

    public ResponseEntity<ApiResponse> deleteResp(String id) {
        try {
            Users users = this.usersRepository.findById(id)
                    .orElseThrow(() -> new NotFoundException("Can't find user id: " + id));
            this.usersRepository.delete(users);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (NotFoundException ex) {
            ApiResponse apiResponse = new ApiResponse(HttpStatus.NOT_FOUND, ex.getMessage());
            return new ResponseEntity<>(apiResponse, HttpStatus.NOT_FOUND);
        }
    }

    @Override
    public List<UsersDto> findAll() {
        List<Users> users = this.usersRepository.findAll();
        List<UsersDto> usersDtos = users.stream().map(user -> this.usersToDto(user)).collect(Collectors.toList());
        return usersDtos;
    }

    public ResponseEntity<List<UsersDto>> findAllResp() {
        List<Users> users = this.usersRepository.findAll();
        if (users.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        List<UsersDto> usersDtos = users.stream()
                .map(user -> this.usersToDto(user))
                .collect(Collectors.toList());
        return new ResponseEntity<>(usersDtos, HttpStatus.OK);
    }

    @Override
    public UsersDto findById(String id) {
        Users users = this.usersRepository.findById(id).orElseThrow(() ->  new NotFoundException("Không tìm thấy id: "+id));
        return usersToDto(users);
    }
    @Override
    public UserResponse getAllPosts(Integer pageNumber, Integer pageSize, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);

        Page<Users> users = usersRepository.findAll(pageable);

        List<Users> listOfPosts = users.getContent();

        List<AuthorDto> authors= listOfPosts.stream().map(user -> this.usersToAuthorDto(user)).collect(Collectors.toList());

        UserResponse userResponse = new UserResponse();
        userResponse.setData(authors);
        userResponse.setPageNumber(users.getNumber());
        userResponse.setPageSize(users.getSize());
        userResponse.setTotalElements(users.getTotalElements());
        userResponse.setTotalPages(users.getTotalPages());
        userResponse.setLastPage(users.isLast());

        return userResponse;
    }

    @Override
    public UsersDto updateForAdmin(String id, UsersDto usersDto) {
        Users users = dtoToUsers(usersDto);
        users.setUserId(id);
        Users userSave = usersRepository.save(users);
        return usersToDto(userSave);
    }

    public List<AuthorDto> findByKeywords(String keywords) {
            List<Users> users=usersRepository.findByKeywords(keywords);
            if(users==null) {
                throw  new NotFoundException("Không tìm thấy"+keywords);
            }else {
                List<AuthorDto> authors= users.stream().map(user -> this.usersToAuthorDto(user)).collect(Collectors.toList());
                return authors;
            }
    }

    public Users findByIdUser(String id) { // nhận Users
        return this.usersRepository.findById(id).orElseThrow(() -> new NotFoundException("Can't find user id: " + id));
    }

    public Optional<Users> findUerByEmail(String email){
        Optional<Users> user = usersRepository.findByEmailAndPasswordNotNull(email);
        return user;
    }

    public Users dtoToUsers(UsersDto usersDto) {
        return this.modelMapper.map(usersDto, Users.class);
    }

    public UsersDto usersToDto(Users users) {
        return this.modelMapper.map(users, UsersDto.class);
    }

    public AuthorDto usersToAuthorDto (Users user) {
        return this.modelMapper.map(user,AuthorDto.class);
    }


}
